import { db } from "@/lib/db"
import { getDefaultPack } from "@/data/default-exam-packs"

export async function generateDiagnosticPaper(projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId }, include: { examPoints: true } })
  if (!project) throw new Error("项目不存在")
  let points = project.examPoints

  // 无资料兜底
  if (points.length === 0) {
    const pack = getDefaultPack(project.subjectName)
    if (pack) {
      await db.examPoint.createMany({ data: pack.points.map(p => ({ projectId, title: p.title, chapterTitle: p.chapterTitle, estimatedScoreMin: p.estimatedScoreMin, estimatedScoreMax: p.estimatedScoreMax, hitRate: p.hitRate, avgStudyMinutes: p.avgStudyMinutes, targetTier: p.targetTier, importanceTier: p.importanceTier, sourceEvidence: { source: "default_pack", disclaimer: pack.disclaimer } })) })
      await db.examScope.upsert({ where: { projectId }, create: { projectId, sourceType: "default_pack", title: `${project.subjectName} 通用考纲`, overallCoverage: 0.5, chapterTree: [] }, update: { sourceType: "default_pack" } })
      points = await db.examPoint.findMany({ where: { projectId } })
    }
  }

  const candidates = points.filter(p => p.importanceTier === "must" || p.importanceTier === "important").slice(0, 15)
  const questions = candidates.map((ep, i) => ({
    type: "choice", difficulty: 2,
    stem: `【${ep.title}】以下关于该考点的说法正确的是？`,
    options: ["A", "B", "C", "D"],
    answer: { correctIndex: 0 },
    explanation: "V1 规则模板题目，需连接 AI 生成真实内容。",
    examPointTitle: ep.title,
  }))
  const totalQuestions = Math.min(questions.length, 20)

  const run = await db.diagnosticRun.create({ data: { projectId, status: "generated", totalQuestions, correctCount: 0, paperSnapshot: { questions, generatedAt: new Date().toISOString() } } })
  return { diagnosticId: run.id, questions, totalQuestions, estimatedMinutes: totalQuestions * 2 }
}
