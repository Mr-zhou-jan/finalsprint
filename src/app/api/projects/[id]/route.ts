import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const project = await db.project.findUnique({
    where: { id, userId: user.id },
    include: { materials: true, examPoints: true, diagnosticRuns: { orderBy: { createdAt: "desc" } }, sprintPlans: true },
  })
  if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  return NextResponse.json({ project })
}
