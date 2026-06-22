import { db } from "@/lib/db"
import { computeWeakOpportunities } from "@/features/sprint-plan/opportunity-scorer"
import { estimateReachProbability } from "@/features/sprint-plan/probability-estimator"
import type { ComputeOpportunityInput } from "@/types/algorithms"

export async function buildDiagnosticReport(projectId: string, diagnosticId: string, userAnswers: Record<string, string>) {
  const project = await db.project.findUnique({ where: { id: projectId }, include: { examPoints: true, examScope: true } })
  const diagnostic = await db.diagnosticRun.findUnique({ where: { id: diagnosticId } })
  if (!project || !diagnostic) throw new Error("数据不存在")

  const paperSnapshot = diagnostic.paperSnapshot as any
  const questions = paperSnapshot?.questions || []
  let correctCount = 0
  const gradingDetails = questions.map((q: any, i: number) => {
    const userA = userAnswers[String(i)] || ""
    let correct = false
    if (q.type === "single") correct = Number(userA) === q.answer?.correctIndex
    else correct = String(userA).trim().toLowerCase() === String(q.answer?.value || "").trim().toLowerCase()
    if (correct) correctCount++
    return { questionIndex: i, correct, userAnswer: userA, examPointTitle: q.examPointTitle }
  })

  // 按考点统计并更新掌握度
  const pointStats: Record<string, { total: number; correct: number }> = {}
  for (const g of gradingDetails) {
    const k = g.examPointTitle || "unknown"
    if (!pointStats[k]) pointStats[k] = { total: 0, correct: 0 }
    pointStats[k].total++; if (g.correct) pointStats[k].correct++
  }
  for (const [title, stat] of Object.entries(pointStats)) {
    const confidence = Math.round((stat.correct / stat.total) * 100)
    const status = confidence >= 80 ? "good" : confidence >= 50 ? "pass" : "weak"
    await db.examPoint.updateMany({ where: { projectId, title }, data: { masteryStatus: status, confidenceScore: confidence } })
  }

  // 估分
  const predictedMid = Math.round((correctCount / questions.length) * 100)
  const predictedMin = Math.max(0, predictedMid - 10)
  const predictedMax = Math.min(100, predictedMid + 10)

  await db.diagnosticRun.update({ where: { id: diagnosticId }, data: { status: "graded", correctCount, predictedMin, predictedMax, gradingSnapshot: { details: gradingDetails, pointStats }, answerSnapshot: { answers: Object.entries(userAnswers).map(([k, v]) => ({ index: Number(k), userAnswer: v })) } } })
  await db.project.update({ where: { id: projectId }, data: { predictedMin, predictedMax } })

  // 机会值与风险
  const daysLeft = Math.max(1, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))
  const inputs: ComputeOpportunityInput[] = project.examPoints.map(ep => ({
    examPointId: ep.id, title: ep.title,
    estimatedScoreMin: ep.estimatedScoreMin, estimatedScoreMax: ep.estimatedScoreMax,
    hitRate: ep.hitRate, avgStudyMinutes: ep.avgStudyMinutes,
    targetTier: (ep.targetTier as any) || "all", importanceTier: (ep.importanceTier as any) || "important",
    confidenceScore: ep.confidenceScore, userTargetTier: "75", daysLeft,
  }))
  const weakOpportunities = computeWeakOpportunities(inputs).slice(0, 5)
  const riskReport = estimateReachProbability({ predictedMin, predictedMax, targetScore: project.targetScore, daysLeft, dailyMinutes: project.dailyMinutes, overallCoverage: project.examScope?.overallCoverage ?? null, recentCompletionRate: 0.7 })

  await db.diagnosticRun.update({ where: { id: diagnosticId }, data: { weakOpportunities: weakOpportunities as any, riskReport: riskReport as any } })

  return { diagnosticId, correctCount, totalQuestions: questions.length, predictedMin, predictedMax, weakOpportunities, riskReport, pointStats: Object.entries(pointStats).map(([k, v]) => ({ pointTitle: k, correct: v.correct, total: v.total })), gradingDetails }
}
