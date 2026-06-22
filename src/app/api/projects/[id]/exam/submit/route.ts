import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { gradeMockExam } from "@/features/exam/mock-exam.service"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params; const { sessionId, answers } = await req.json()
  try { return NextResponse.json(await gradeMockExam(user.id, id, sessionId, answers)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
