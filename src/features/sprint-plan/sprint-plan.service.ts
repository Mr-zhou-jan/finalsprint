import { db } from "@/lib/db"
import { computeWeakOpportunities } from "./opportunity-scorer"
import { allocateDailyTasks } from "./daily-task-allocator"
import { estimateReachProbability } from "./probability-estimator"
import type { ComputeOpportunityInput } from "@/types/algorithms"

export async function generateSprintPlan(projectId: string, targetTier: "pass" | "75" | "85") {
  const project = await db.project.findUnique({ where: { id: projectId }, include: { examPoints: true, examScope: true } })
  if (!project) throw new Error("项目不存在")
  const daysLeft = Math.max(1, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))

  const inputs: ComputeOpportunityInput[] = project.examPoints.map(ep => ({
    examPointId: ep.id, title: ep.title,
    estimatedScoreMin: ep.estimatedScoreMin, estimatedScoreMax: ep.estimatedScoreMax,
    hitRate: ep.hitRate, avgStudyMinutes: ep.avgStudyMinutes,
    targetTier: (ep.targetTier as any) || "all", importanceTier: (ep.importanceTier as any) || "important",
    confidenceScore: ep.confidenceScore, userTargetTier: targetTier, daysLeft,
  }))
  const opportunities = computeWeakOpportunities(inputs)
  const allocResult = allocateDailyTasks({ opportunities, dailyMinutes: project.dailyMinutes, targetTier, daysLeft, overallCoverage: project.examScope?.overallCoverage ?? null })

  const diagnostic = await db.diagnosticRun.findFirst({ where: { projectId }, orderBy: { createdAt: "desc" } })
  const probResult = estimateReachProbability({
    predictedMin: diagnostic?.predictedMin ?? project.predictedMin ?? 30,
    predictedMax: diagnostic?.predictedMax ?? project.predictedMax ?? 50,
    targetScore: project.targetScore, daysLeft, dailyMinutes: project.dailyMinutes,
    overallCoverage: project.examScope?.overallCoverage ?? null, recentCompletionRate: 0.7,
  })

  const existingPlan = await db.sprintPlan.findUnique({ where: { projectId } })
  const plan = existingPlan
    ? await db.sprintPlan.update({ where: { projectId }, data: { targetTier, totalDays: daysLeft, strategySummary: { text: allocResult.strategySummary, abandonAdvice: allocResult.abandonAdvice }, latestPredScore: probResult.predictedIfOnTrack } })
    : await db.sprintPlan.create({ data: { projectId, targetTier, totalDays: daysLeft, strategySummary: { text: allocResult.strategySummary, abandonAdvice: allocResult.abandonAdvice }, startScore: diagnostic?.predictedMin ?? 30, targetScore: project.targetScore, latestPredScore: probResult.predictedIfOnTrack } })

  if (!existingPlan) {
    await db.studyTask.createMany({ data: allocResult.tasks.map(t => ({ projectId, planId: plan.id, examPointId: t.examPointId || null, date: new Date(t.date), title: t.title, taskType: t.taskType, priority: t.priority, estimatedMinutes: t.estimatedMinutes, expectedGain: t.expectedGain, sourceReason: t.sourceReason })) })
  }
  return { plan, opportunities: opportunities.slice(0, 10), probability: probResult, allocResult }
}
