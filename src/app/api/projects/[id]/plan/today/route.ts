import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const plan = await db.sprintPlan.findUnique({ where: { projectId: id }, include: { tasks: { where: { status: { in: ["todo", "doing"] } }, orderBy: { priority: "asc" } } } })
  if (!plan) return NextResponse.json({ tasks: [], message: "尚未生成冲刺计划" })
  const todayTasks = plan.tasks.slice(0, 10)
  const totalMins = todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0)
  const totalGain = todayTasks.reduce((s, t) => s + (t.expectedGain || 0), 0)
  const project = await db.project.findUnique({ where: { id } })
  return NextResponse.json({ tasks: todayTasks, totalEstimatedMinutes: totalMins, totalExpectedGain: Math.round(totalGain), predictedAfterToday: (project?.predictedMax ?? 0) + Math.round(totalGain * 0.3) })
}
