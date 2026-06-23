import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params; const { diagnosticId, answers } = await req.json()
  if (!diagnosticId || !answers) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  const { data: diag } = await supabase.from("DiagnosticRun").select("paperSnapshot").eq("id", diagnosticId).single()
  const qs = (diag?.paperSnapshot as any)?.questions || []; let c = 0
  for (let i=0;i<qs.length;i++){ const q=qs[i]; const ua=answers[String(i)]||""; if(q.type==="single"?Number(ua)===q.answer?.correctIndex:String(ua).trim()===String(q.answer?.value||"").trim())c++ }
  const mid=Math.round((c/Math.max(qs.length,1))*100); const pMin=Math.max(0,mid-10); const pMax=Math.min(100,mid+10)
  await supabase.from("DiagnosticRun").update({ status:"graded",correctCount:c,predictedMin:pMin,predictedMax:pMax,answerSnapshot:{answers}}).eq("id",diagnosticId)
  await supabase.from("Project").update({ predictedMin:pMin,predictedMax:pMax }).eq("id",pid)
  return NextResponse.json({ diagnosticId,correctCount:c,totalQuestions:qs.length,predictedMin:pMin,predictedMax:pMax,weakOpportunities:[],riskReport:{warnings:[]} })
}
