import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params; const { targetTier } = await req.json()
  const { data: p } = await supabase.from("Project").select("*").eq("id", pid).single()
  const days = Math.max(1, Math.ceil((new Date(p?.examDate).getTime()-Date.now())/86400000))

  const { data: plan } = await supabase.from("SprintPlan").upsert({
    projectId:pid, targetTier:targetTier||"75", totalDays:days, dailyMinutes:p?.dailyMinutes||60, targetScore:p?.targetScore||60, startScore:p?.predictedMin||30
  }, { onConflict: "projectId" }).select("id").single()

  if (plan?.id) {
    const { data: existing } = await supabase.from("StudyTask").select("id").eq("planId", plan.id).limit(1)
    if (!existing || existing.length === 0) {
      const tasks = [
        { planId: plan.id, projectId: pid, taskType: "learn", title: `复习核心概念（${targetTier||"75"}路线）`, priority: 1, estimatedMinutes: 30, expectedGain: 5, status: "todo", sourceReason: "high_roi" },
        { planId: plan.id, projectId: pid, taskType: "practice", title: `做一组专项练习`, priority: 1, estimatedMinutes: 25, expectedGain: 3, status: "todo", sourceReason: "high_roi" },
        { planId: plan.id, projectId: pid, taskType: "review", title: "回顾错题和薄弱知识点", priority: 2, estimatedMinutes: 15, expectedGain: 2, status: "todo", sourceReason: "weak_point" },
        { planId: plan.id, projectId: pid, taskType: "practice", title: "做1套真题模拟（限时）", priority: 3, estimatedMinutes: 40, expectedGain: 4, status: "todo", sourceReason: "exam_hotspot" },
      ]
      for (const task of tasks) {
        await supabase.from("StudyTask").insert(task).select("id")
      }
    }
  }

  return NextResponse.json({ plan, opportunities:[], probability:{} })
}
