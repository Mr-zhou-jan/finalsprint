import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const { data: project } = await supabase.from("Project").select("*").eq("id", id).eq("userId", user.id).single()
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 })

  // 获取关联数据
  const [{ data: materials }, { data: examPoints }, { data: diagnostics }, { data: plan }] = await Promise.all([
    supabase.from("Material").select("*").eq("projectId", id),
    supabase.from("ExamPoint").select("*").eq("projectId", id),
    supabase.from("DiagnosticRun").select("*").eq("projectId", id).order("createdAt", { ascending: false }),
    supabase.from("SprintPlan").select("*, tasks:StudyTask(*)").eq("projectId", id).single(),
  ])

  return NextResponse.json({
    project: { ...project, materials: materials || [], examPoints: examPoints || [], diagnosticRuns: diagnostics || [], sprintPlan: plan }
  })
}
