import { db } from "@/lib/db"

export async function generatePracticeQuestions(projectId: string, examPointId: string, count: number = 5) {
  const examPoint = await db.examPoint.findUnique({ where: { id: examPointId } })
  if (!examPoint) throw new Error("考点不存在")
  let questions = await db.practiceQuestion.findMany({ where: { examPointId }, take: count })
  if (questions.length < count) {
    const needed = count - questions.length
    const templates = Array.from({ length: needed }, (_, i) => i % 2 === 0 ? {
      type: "single" as const, difficulty: 2, source: "generated" as const,
      stem: `【${examPoint.title}】以下说法正确的是？`,
      options: ["A. 选项一", "B. 选项二", "C. 选项三", "D. 选项四"],
      answer: { correctIndex: 0 },
      explanation: `这是关于${examPoint.title}的基础概念题。`,
    } : {
      type: "fill" as const, difficulty: 2, source: "generated" as const,
      stem: `【${examPoint.title}】请写出核心公式或关键步骤：`,
      answer: { value: "公式答案" },
      explanation: `掌握${examPoint.title}的核心公式是做题的基础。`,
    })
    await db.practiceQuestion.createMany({ data: templates.map(t => ({ projectId, examPointId, ...t })) })
    questions = await db.practiceQuestion.findMany({ where: { examPointId }, take: count, orderBy: { createdAt: "desc" } })
  }
  const session = await db.practiceSession.create({ data: { projectId, mode: "point_practice", totalQuestions: questions.length, status: "in_progress", startedAt: new Date() } })
  return { sessionId: session.id, questions, totalQuestions: questions.length }
}
