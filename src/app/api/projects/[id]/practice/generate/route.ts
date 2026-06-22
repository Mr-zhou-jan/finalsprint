import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { generatePracticeQuestions } from "@/features/practice/practice-generator.service"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params; const { examPointId, count } = await req.json()
  try { return NextResponse.json(await generatePracticeQuestions(id, examPointId, count || 5)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
