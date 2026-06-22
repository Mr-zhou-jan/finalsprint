import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const projects = await db.project.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { subjectName, examDate, targetScore, currentLevel, dailyMinutes } = await req.json()
  if (!subjectName || !examDate || !targetScore) return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
  const project = await db.project.create({
    data: { userId: user.id, subjectName, examDate: new Date(examDate), targetScore, currentLevel, dailyMinutes }
  })
  return NextResponse.json({ id: project.id })
}
