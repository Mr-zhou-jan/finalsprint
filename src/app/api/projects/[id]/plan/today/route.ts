import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const { data: plans } = await supabase.from("SprintPlan").select("id").eq("projectId", id).limit(1)
  if (!plans?.length) return NextResponse.json({ tasks: [], message: "尚未生成冲刺计划" })
  const { data: tasks } = await supabase.from("StudyTask").select("*").eq("projectId", id).in("status", ["todo","doing"]).order("priority", { ascending: true }).limit(10)
  const list = tasks || []
  const m = list.reduce((s:number,t:any)=>s+(t.estimatedMinutes||0),0)
  const g = list.reduce((s:number,t:any)=>s+(t.expectedGain||0),0)
  const { data: p } = await supabase.from("Project").select("predictedMax").eq("id", id).single()
  return NextResponse.json({ tasks: list, totalEstimatedMinutes: m, totalExpectedGain: Math.round(g), predictedAfterToday: (p?.predictedMax||0)+Math.round(g*.3) })
}
