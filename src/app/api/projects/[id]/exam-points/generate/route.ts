import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: projectId } = await params
  const { name, materialId } = await req.json()
  if (!name) return NextResponse.json({ error: "缺少考点名称" }, { status: 400 })

  const { data: ep } = await supabase.from("ExamPoint").insert({
    projectId, title: name,
    summary: `${name}相关知识点`,
    estimatedScoreMin: 3, estimatedScoreMax: 8,
    hitRate: 0.5, avgStudyMinutes: 20, roiScore: 0.6,
    importanceTier: "important", targetTier: "all",
    formulas: [{ name: name, latex: "\text{公式}", note: "待补充" }],
    commonPatterns: ["选择题", "填空题", "计算题"],
    solvingTemplate: ["理解题意", "套用公式", "计算得出"],
    traps: ["注意单位", "检查边界条件"],
    masteryStatus: "unknown", confidenceScore: 0,
  }).select("id").single()

  return NextResponse.json({ id: ep?.id })
}
