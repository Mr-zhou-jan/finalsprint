import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

// 预设练习题目
const PRESET_QUESTIONS: { stem: string; options: string[]; correctIndex: number; explanation: string }[] = [
  { stem: "极限 lim(x→0) sinx/x 的值是？", options: ["A. 0", "B. 1", "C. ∞", "D. 不存在"], correctIndex: 1, explanation: "第一个重要极限" },
  { stem: "函数 f(x)=x³ 的导数是？", options: ["A. 3x²", "B. x²", "C. 3x", "D. 3x³"], correctIndex: 0, explanation: "(xⁿ)' = nx^(n-1)" },
  { stem: "∫ cosx dx = ？", options: ["A. sinx + C", "B. cosx + C", "C. -sinx + C", "D. -cosx + C"], correctIndex: 0, explanation: "∫ cosx dx = sinx + C" },
  { stem: "曲线 y=x² 在 (1,1) 处的切线斜率是？", options: ["A. 1", "B. 2", "C. 0", "D. -1"], correctIndex: 1, explanation: "y'=2x，代入x=1得2" },
  { stem: "以下哪个是奇函数？", options: ["A. cosx", "B. x²", "C. sinx", "D. e^x"], correctIndex: 2, explanation: "sin(-x)=-sinx" },
  { stem: "微分方程 y'' + y = 0 的特征方程是？", options: ["A. r² + 1 = 0", "B. r + 1 = 0", "C. r² - 1 = 0", "D. r² + r = 0"], correctIndex: 0, explanation: "y''对应r²" },
  { stem: "若 A 为 3×4 矩阵，则 AT 是几行几列？", options: ["A. 3×4", "B. 4×3", "C. 3×3", "D. 4×4"], correctIndex: 1, explanation: "转置行变列" },
  { stem: "P(A|B) 表示什么？", options: ["A. A和B同时发生", "B. B发生时A的概率", "C. A发生时B的概率", "D. A或B发生"], correctIndex: 1, explanation: "条件概率" },
]

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params; const { examPointId, count } = await req.json()

  if (examPointId) {
    const { data: qs } = await supabase.from("PracticeQuestion").select("*").eq("examPointId", examPointId).limit(count||5)
    if (qs && qs.length > 0) {
      const { data: s } = await supabase.from("PracticeSession").insert({ projectId:pid, mode:"point_practice", totalQuestions:qs.length, status:"in_progress" }).select("id").single()
      return NextResponse.json({ sessionId:s?.id, questions:qs, totalQuestions:qs.length })
    }
  }

  // 无题时用预设题目
  const shuffled = [...PRESET_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, count || 5)
  const questions = shuffled.map((q, i) => ({
    id: `preset-${Date.now()}-${i}`, type: "single", difficulty: 2, stem: q.stem, options: q.options, answer: { correctIndex: q.correctIndex }, explanation: q.explanation, scoreValue: 5, examPointId: examPointId || "general",
  }))
  const { data: s } = await supabase.from("PracticeSession").insert({ projectId:pid, mode:"point_practice", totalQuestions:questions.length, status:"in_progress" }).select("id").single()
  return NextResponse.json({ sessionId:s?.id, questions, totalQuestions:questions.length })
}
