import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

// 预设诊断题 - 当数据库中无考点时使用预设题目
const PRESET_QUESTIONS: { stem: string; options: string[]; correctIndex: number; explanation: string }[] = [
  { stem: "极限 lim(x→0) sinx/x 的值是？", options: ["A. 0", "B. 1", "C. ∞", "D. 不存在"], correctIndex: 1, explanation: "这是第一个重要极限，lim(x→0) sinx/x = 1" },
  { stem: "函数 f(x)=x² 的导数是？", options: ["A. x", "B. 2x", "C. 2", "D. x²"], correctIndex: 1, explanation: "幂函数求导公式：(xⁿ)' = nx^(n-1)，所以 (x²)' = 2x" },
  { stem: "不定积分 ∫2x dx = ？", options: ["A. x² + C", "B. 2x² + C", "C. x²", "D. 2 + C"], correctIndex: 0, explanation: "∫2x dx = x² + C，C为任意常数" },
  { stem: "以下哪个是微分方程 y' = y 的通解？", options: ["A. y = e^x", "B. y = Ce^x", "C. y = e^x + C", "D. y = x + C"], correctIndex: 1, explanation: "y' = y 的通解为 y = Ce^x，C为任意常数" },
  { stem: "定积分 ∫₀¹ x dx = ？", options: ["A. 0", "B. 0.5", "C. 1", "D. 2"], correctIndex: 1, explanation: "∫₀¹ x dx = [x²/2]₀¹ = 1/2" },
  { stem: "函数在x₀处可导的充分必要条件是？", options: ["A. 连续", "B. 左右导数存在且相等", "C. 有定义", "D. 极限存在"], correctIndex: 1, explanation: "可导的充要条件是左右导数存在且相等" },
  { stem: "d/dx (e^x) = ？", options: ["A. e^x", "B. xe^(x-1)", "C. e^x ln e", "D. 1"], correctIndex: 0, explanation: "e^x 的导数仍为 e^x，这是指数函数的特殊性质" },
  { stem: "复合函数求导的法则称为？", options: ["A. 乘积法则", "B. 链式法则", "C. 洛必达法则", "D. 莱布尼茨法则"], correctIndex: 1, explanation: "复合函数求导使用链式法则：dy/dx = dy/du · du/dx" },
  { stem: "牛顿-莱布尼茨公式联系了哪两个概念？", options: ["A. 导数和极限", "B. 定积分和不定积分", "C. 微分和积分", "D. 连续和可导"], correctIndex: 1, explanation: "牛顿-莱布尼茨公式：∫ₐᵇ f(x)dx = F(b)-F(a)，联系了定积分和不定积分" },
  { stem: "sinx 在 x=0 处的泰勒展开第一项是？", options: ["A. x", "B. 1", "C. 0", "D. x²/2"], correctIndex: 0, explanation: "sinx = x - x³/3! + x⁵/5! - ...，第一项是 x" },
]

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: projectId } = await params

  const { data: points } = await supabase.from("ExamPoint").select("*").eq("projectId", projectId).limit(15)

  let questions: any[] = []
  if (points && points.length > 0) {
    questions = points.map((ep: any) => ({
      type: "single", difficulty: 2,
      stem: `【${ep.title}】以下关于该考点的说法正确的是？`,
      options: ["A. 正确理解概念即可作答", "B. 需要结合公式计算", "C. 属于证明题型", "D. 以上都不对"],
      answer: { correctIndex: 0 }, explanation: `考查${ep.title}的基本概念。`, examPointTitle: ep.title,
    }))
  } else {
    const shuffled = [...PRESET_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    questions = shuffled.map((q) => ({
      type: "single", difficulty: 2,
      stem: q.stem, options: q.options,
      answer: { correctIndex: q.correctIndex },
      explanation: q.explanation,
      examPointTitle: `综合题`,
    }))
  }

  const total = Math.min(questions.length || 10, 20)
  const { data: diag } = await supabase.from("DiagnosticRun").insert({
    projectId, status: "generated", totalQuestions: total, correctCount: 0, paperSnapshot: { questions }
  }).select("id").single()

  return NextResponse.json({ diagnosticId: diag?.id, questions, totalQuestions: total, estimatedMinutes: total * 2 })
}
