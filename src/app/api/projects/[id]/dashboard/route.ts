import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const { data: project } = await supabase.from("Project").select("*").eq("id", id).single()
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  const { data: diagnostics } = await supabase.from("DiagnosticRun").select("*").eq("projectId", id).order("createdAt", { ascending: false }).limit(1)
  const d = diagnostics?.[0]
  const pMin = d?.predictedMin ?? project.predictedMin ?? 30
  const pMax = d?.predictedMax ?? project.predictedMax ?? 50
  const { data: tasks } = await supabase.from("StudyTask").select("*").eq("projectId", id).in("status", ["todo","doing"]).order("priority", { ascending: true }).limit(10)
  return NextResponse.json({ currentScore:{min:pMin,max:pMax}, targetScore:project.targetScore, scoreGap:Math.max(0,project.targetScore-pMax), passProbability:pMax>=60?.7:.4, targetProbability:.3, predictedIfOnTrack:Math.min(pMax+5,100), completionRisk:"medium", warnings:[], topOpportunities:[], todayTasks:{tasks:tasks||[],totalMinutes:(tasks||[]).reduce((s:number,t:any)=>s+(t.estimatedMinutes||0),0),totalGain:0}, coverageGap:.5 })
}
