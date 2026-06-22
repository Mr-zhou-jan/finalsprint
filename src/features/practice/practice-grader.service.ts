import { db } from "@/lib/db"

export async function submitPracticeAnswers(userId: string, projectId: string, sessionId: string, answers: Record<string, string>) {
  const session = await db.practiceSession.findUnique({ where: { id: sessionId } })
  if (!session) throw new Error("会话不存在")
  const questions = await db.practiceQuestion.findMany({ where: { id: { in: Object.keys(answers) } } })
  let correctCount = 0; const results: any[] = []

  for (const q of questions) {
    const userAnswer = answers[q.id] || ""
    let isCorrect = q.type === "single" ? Number(userAnswer) === (q.answer as any)?.correctIndex : String(userAnswer).trim().toLowerCase() === String((q.answer as any)?.value || "").trim().toLowerCase()
    if (isCorrect) correctCount++
    const attempt = await db.questionAttempt.create({ data: { userId, projectId, questionId: q.id, sessionId, userAnswer: { value: userAnswer }, isCorrect, errorType: isCorrect ? null : "no_idea" } })
    if (!isCorrect) {
      const ep = await db.examPoint.findUnique({ where: { id: q.examPointId } })
      await db.wrongQuestion.upsert({ where: { attemptId: attempt.id }, create: { userId, projectId, questionId: q.id, attemptId: attempt.id, errorReason: "no_idea", status: "active", recommendedAction: `复习「${ep?.title || "相关考点"}」的基础概念` }, update: { status: "active" } })
    }
    results.push({ questionId: q.id, isCorrect, userAnswer, explanation: q.explanation, correctAnswer: q.answer })
  }

  await db.practiceSession.update({ where: { id: sessionId }, data: { correctCount, status: "completed", endedAt: new Date(), resultJson: { results } } })
  const pointIds = [...new Set(questions.map(q => q.examPointId))]
  for (const pid of pointIds) {
    const pq = questions.filter(q => q.examPointId === pid)
    const pc = pq.filter(q => results.find(r => r.questionId === q.id)?.isCorrect).length
    const conf = Math.round((pc / pq.length) * 100)
    await db.examPoint.update({ where: { id: pid }, data: { masteryStatus: conf >= 80 ? "good" : conf >= 50 ? "pass" : "weak", confidenceScore: conf } })
  }
  return { sessionId, correctCount, totalQuestions: questions.length, results, accuracy: Math.round((correctCount / questions.length) * 100) }
}
