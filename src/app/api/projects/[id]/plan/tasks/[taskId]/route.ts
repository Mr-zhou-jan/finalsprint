import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { taskId } = await params; const { status } = await req.json()
  const u: any = { status }; if (status === "done") u.completedAt = new Date().toISOString()
  const { data: task } = await supabase.from("StudyTask").update(u).eq("id", taskId).select("*").single()
  return NextResponse.json({ task })
}
