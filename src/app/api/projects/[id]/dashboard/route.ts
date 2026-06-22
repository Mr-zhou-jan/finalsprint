import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { estimateReachProbability } from "@/features/sprint-plan/probability-estimator"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const project = await db.project.findUnique({ where: { id }, include: { examScope: true, diagnosticRuns: { orderBy: { createdAt: "desc" }, take: 1 } } })
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  const diagnostic = project.diagnosticRuns[0]
  const pMin = diagnostic?.predictedMin ?? project.predictedMin ?? 30
  const pMax = diagnostic?.predictedMax ?? project.predictedMax ?? 50
  const daysLeft = Math.max(1, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))
  const prob = estimateReachProbability({ predictedMin: pMin, predictedMax: pMax, targetScore: project.targetScore, daysLeft, dailyMinutes: project.dailyMinutes, overallCoverage: project.examScope?.overallCoverage ?? null, recentCompletionRate: 0.7 })
  const topOpps = ((diagnostic?.weakOpportunities as any[]) || []).slice(0, 3)
  const todayTasks = await db.studyTask.findMany({ where: { projectId: id, status: { in: ["todo", "doing"] } }, orderBy: { priority: "asc" }, take: 8 })
  return NextResponse.json({ currentScore: { min: pMin, max: pMax }, targetScore: project.targetScore, scoreGap: Math.max(0, project.targetScore - pMax), ...prob, topOpportunities: topOpps, todayTasks: { tasks: todayTasks, totalMinutes: todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0), totalGain: Math.round(todayTasks.reduce((s, t) => s + (t.expectedGain || 0), 0)) }, coverageGap: 1 - (project.examScope?.overallCoverage ?? 0.5) })
}
