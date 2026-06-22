import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { buildDiagnosticReport } from "@/features/diagnostic/diagnostic-report.service"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const { diagnosticId, answers } = await req.json()
  if (!diagnosticId || !answers) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  try { return NextResponse.json(await buildDiagnosticReport(id, diagnosticId, answers)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
