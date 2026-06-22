import { db } from "@/lib/db"

export async function getErrorBook(projectId: string, userId: string) {
  const errors = await db.wrongQuestion.findMany({
    where: { projectId, userId },
    include: { question: true, attempt: { select: { userAnswer: true, isCorrect: true, errorType: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  })
  const grouped: Record<string, typeof errors> = {}
  for (const e of errors) {
    const pid = e.question.examPointId
    if (!grouped[pid]) grouped[pid] = []
    grouped[pid].push(e)
  }
  const points = await db.examPoint.findMany({ where: { id: { in: Object.keys(grouped) } } })
  const names: Record<string, string> = {}; for (const p of points) names[p.id] = p.title

  return {
    totalErrors: errors.length,
    unresolvedErrors: errors.filter(e => e.status === "active").length,
    groupedByPoint: Object.entries(grouped).map(([pid, items]) => ({
      examPointId: pid, examPointTitle: names[pid] || "未知考点",
      total: items.length, unresolved: items.filter(e => e.status === "active").length,
      items: items.map(e => ({ id: e.id, questionStem: e.question.stem, type: e.question.type, userAnswer: e.attempt.userAnswer, correctAnswer: e.question.answer, errorReason: e.errorReason, recommendedAction: e.recommendedAction, status: e.status, createdAt: e.createdAt })),
    })),
  }
}

export async function resolveError(errorId: string) {
  return db.wrongQuestion.update({ where: { id: errorId }, data: { status: "resolved", resolvedAt: new Date() } })
}
