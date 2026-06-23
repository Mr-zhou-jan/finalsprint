import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

// 预设模拟考题
const PRESET_EXAM_QUESTIONS = [
  { stem: "极限 lim(x→0) (sin5x)/(3x) = ？", type: "single", options: ["A. 5/3", "B. 3/5", "C. 0", "D. 1"], answer: { correctIndex: 0 }, scoreValue: 5, difficulty: 2 },
  { stem: "函数 f(x)=ln(x²+1) 的导数 f'(x) = ？", type: "single", options: ["A. 2x/(x²+1)", "B. 1/(x²+1)", "C. 2x ln(x²+1)", "D. 2x"], answer: { correctIndex: 0 }, scoreValue: 5, difficulty: 2 },
  { stem: "定积分 ∫₀^π sinx dx = ？", type: "single", options: ["A. 0", "B. 1", "C. 2", "D. π"], answer: { correctIndex: 2 }, scoreValue: 5, difficulty: 2 },
  { stem: "以下哪个函数在 x=0 处不可导？", type: "single", options: ["A. y=x²", "B. y=|x|", "C. y=sinx", "D. y=e^x"], answer: { correctIndex: 1 }, scoreValue: 5, difficulty: 3 },
  { stem: "∫ xe^x dx = ？", type: "single", options: ["A. e^x + C", "B. xe^x - e^x + C", "C. (x²/2)e^x + C", "D. e^x(x+1) + C"], answer: { correctIndex: 1 }, scoreValue: 5, difficulty: 3 },
  { stem: "微分方程 y'' + y = 0 的通解是？", type: "single", options: ["A. y = C₁e^x + C₂e^(-x)", "B. y = C₁cosx + C₂sinx", "C. y = C₁ + C₂x", "D. y = C₁e^x"], answer: { correctIndex: 1 }, scoreValue: 5, difficulty: 3 },
  { stem: "lim(x→∞) (1 + 1/x)^(2x) = ？", type: "single", options: ["A. e", "B. e²", "C. 1", "D. ∞"], answer: { correctIndex: 1 }, scoreValue: 5, difficulty: 3 },
  { stem: "双曲线 y=1/x 在 x=1 处的切线方程是？", type: "single", options: ["A. y = -x+2", "B. y = x", "C. y = -x", "D. y = -x+1"], answer: { correctIndex: 0 }, scoreValue: 5, difficulty: 3 },
  { stem: "∫₀¹ x²e^x dx 可用什么方法计算？", type: "single", options: ["A. 换元法", "B. 分部积分法", "C. 有理函数积分", "D. 三角代换"], answer: { correctIndex: 1 }, scoreValue: 5, difficulty: 2 },
  { stem: "曲线 y=x³ 在点(1,1)处的切线斜率是？", type: "single", options: ["A. 1", "B. 2", "C. 3", "D. 0"], answer: { correctIndex: 2 }, scoreValue: 5, difficulty: 1 },
]

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params

  // 尝试从数据库读取题目
  const { data: qs } = await supabase.from("PracticeQuestion").select("*").eq("projectId", pid).limit(25)

  let questions: any[]
  if (qs && qs.length > 0) {
    questions = qs
  } else {
    // 用预设题
    questions = PRESET_EXAM_QUESTIONS.map((q, i) => ({
      id: `preset-${i}`, projectId: pid, ...q,
    }))
  }
  const total = questions.reduce((s, q) => s + (q.scoreValue || 5), 0)
  const { data: s } = await supabase.from("PracticeSession").insert({
    projectId: pid, mode: "mock_exam", totalQuestions: questions.length, status: "in_progress",
    resultJson: { totalScore: total, durationMinutes: Math.max(30, questions.length * 2) }
  }).select("id").single()
  return NextResponse.json({
    sessionId: s?.id, questions, totalScore: total,
    durationMinutes: Math.max(30, questions.length * 2), totalQuestions: questions.length
  })
}
