import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { generateMockExam } from "@/features/exam/mock-exam.service"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  try { return NextResponse.json(await generateMockExam((await params).id)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
