import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { taskId } = await params
  const { status } = await req.json()
  const task = await db.studyTask.update({ where: { id: taskId }, data: { status, completedAt: status === "done" ? new Date() : null } })
  return NextResponse.json({ task })
}
