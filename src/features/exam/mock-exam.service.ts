import { db } from "@/lib/db"
import { computeWeakOpportunities } from "@/features/sprint-plan/opportunity-scorer"
import type { ComputeOpportunityInput } from "@/types/algorithms"

export async function generateMockExam(projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId }, include: { examPoints: true } })
  if (!project) throw new Error("项目不存在")
  const questions: any[] = []
  for (const ep of project.examPoints) {
    const existing = await db.practiceQuestion.findMany({ where: { examPointId: ep.id }, take: 3 })
    const count = ep.masteryStatus === "weak" ? Math.min(3, existing.length) : Math.min(1, existing.length)
    questions.push(...existing.slice(0, count))
  }
  const unique = questions.slice(0, Math.min(questions.length, 25))
  const totalScore = unique.reduce((s, q) => s + (q.scoreValue || 5), 0)
  const durationMinutes = Math.max(30, unique.length * 2)
  const session = await db.practiceSession.create({ data: { projectId, mode: "mock_exam", totalQuestions: unique.length, status: "in_progress", startedAt: new Date(), resultJson: { totalScore, durationMinutes } } })
  return { sessionId: session.id, questions: unique, totalScore, durationMinutes, totalQuestions: unique.length }
}

export async function gradeMockExam(userId: string, projectId: string, sessionId: string, answers: Record<string, string>) {
  const project = await db.project.findUnique({ where: { id: projectId }, include: { examPoints: true } })
  if (!project) throw new Error("项目不存在")
  const questions = await db.practiceQuestion.findMany({ where: { id: { in: Object.keys(answers) } } })
  let correctCount = 0; let totalScore = 0; let earnedScore = 0
  const results: any[] = []; const pointStats: Record<string, { correct: number; total: number }> = {}

  for (const q of questions) {
    const userAnswer = answers[q.id] || ""; const qScore = q.scoreValue || 5; totalScore += qScore
    const isCorrect = q.type === "single" ? Number(userAnswer) === (q.answer as any)?.correctIndex : String(userAnswer).trim().toLowerCase() === String((q.answer as any)?.value || "").trim().toLowerCase()
    if (isCorrect) { correctCount++; earnedScore += qScore }
    const ep = await db.examPoint.findUnique({ where: { id: q.examPointId } })
    const epTitle = ep?.title || "未知"
    if (!pointStats[epTitle]) pointStats[epTitle] = { correct: 0, total: 0 }; pointStats[epTitle].total++; if (isCorrect) pointStats[epTitle].correct++
    const attempt = await db.questionAttempt.create({ data: { userId, projectId, questionId: q.id, sessionId, userAnswer: { value: userAnswer }, isCorrect, errorType: isCorrect ? null : "no_idea" } })
    if (!isCorrect) await db.wrongQuestion.upsert({ where: { attemptId: attempt.id }, create: { userId, projectId, questionId: q.id, attemptId: attempt.id, errorReason: "no_idea", status: "active" }, update: { status: "active" } })
    results.push({ questionId: q.id, isCorrect, examPointTitle: epTitle, scoreValue: qScore })
  }

  const scorePercent = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0
  const pMin = Math.max(0, scorePercent - 10); const pMax = Math.min(100, scorePercent + 5)
  await db.project.update({ where: { id: projectId }, data: { predictedMin: pMin, predictedMax: pMax } })
  await db.practiceSession.update({ where: { id: sessionId }, data: { correctCount, status: "completed", endedAt: new Date(), resultJson: { results, pointStats, totalScore, earnedScore, scorePercent } } })

  const daysLeft = Math.max(1, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))
  const inputs: ComputeOpportunityInput[] = project.examPoints.map(ep => ({
    examPointId: ep.id, title: ep.title, estimatedScoreMin: ep.estimatedScoreMin, estimatedScoreMax: ep.estimatedScoreMax, hitRate: ep.hitRate, avgStudyMinutes: ep.avgStudyMinutes, targetTier: (ep.targetTier as any) || "all", importanceTier: (ep.importanceTier as any) || "important", confidenceScore: ep.confidenceScore, userTargetTier: "75", daysLeft,
  }))
  const top3 = computeWeakOpportunities(inputs).slice(0, 3)

  return {
    correctCount, totalQuestions: questions.length, totalScore, earnedScore, scorePercent, predictedMin: pMin, predictedMax: pMax, pointStats,
    sprintAdvice: {
      predictedScore: { min: pMin, max: pMax },
      lastMinuteMustDo: top3.map(o => o.examPointTitle),
      top3ReviewPoints: top3.map(o => ({ title: o.examPointTitle, action: `集中练习${o.estimatedMinutes}分钟`, expectedGain: o.expectedGain })),
      examStrategy: { timeAllocation: "选择30min→填空20min→计算60min→检查10min", answerOrder: "先做会做的，不纠结难题", emergencyTips: ["遇到不会的跳过，最后回来", "公式写对就有分，别空白"] },
      finalCheatSheet: project.examPoints.filter(ep => ep.importanceTier === "must").slice(0, 5).map(ep => ep.title),
    },
  }
}
