import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { data: projects } = await supabase.from("Project").select("*").eq("userId", user.id).order("createdAt", { ascending: false })
  return NextResponse.json({ projects: projects || [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const body = await req.json()
  const { subjectName, examDate, targetScore, currentLevel, dailyMinutes } = body
  if (!subjectName || !examDate || !targetScore) return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
  const { data: project, error } = await supabase.from("Project").insert({
    userId: user.id, subjectName, examDate, targetScore, currentLevel: currentLevel || "weak", dailyMinutes: dailyMinutes || 60
  }).select("id").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: project.id })
}
