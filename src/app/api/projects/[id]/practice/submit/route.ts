import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

// 预设练习题目答案
const PRESET_ANSWERS: Record<string, { correctIndex: number; value?: string }> = {
  "preset-0": { correctIndex: 1 }, "preset-1": { correctIndex: 0 }, "preset-2": { correctIndex: 0 },
  "preset-3": { correctIndex: 1 }, "preset-4": { correctIndex: 2 }, "preset-5": { correctIndex: 0 },
  "preset-6": { correctIndex: 1 }, "preset-7": { correctIndex: 1 },
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params; const { sessionId, answers } = await req.json()
  const ids = Object.keys(answers); if (!ids.length) return NextResponse.json({ error: "无答案" }, { status: 400 })

  const { data: qs } = await supabase.from("PracticeQuestion").select("*").in("id", ids)

  let c = 0

  if (qs && qs.length > 0) {
    for (const q of qs) {
      const ua = answers[q.id] || ""
      const ok = q.type === "single" ? Number(ua) === (q.answer as any)?.correctIndex : String(ua).trim() === String((q.answer as any)?.value || "").trim()
      if (ok) c++
      await supabase.from("QuestionAttempt").insert({ userId: user.id, projectId: pid, questionId: q.id, sessionId, userAnswer: { value: ua }, isCorrect: ok })
    }
  } else {
    // 预设题评分
    for (const [qid, ua] of Object.entries(answers)) {
      const ans = PRESET_ANSWERS[qid] || { correctIndex: 0 }
      const ok = ans.correctIndex !== undefined ? Number(ua) === ans.correctIndex : String(ua).trim() === String(ans.value || "").trim()
      if (ok) c++
    }
  }

  const t = Math.max((qs || []).length || Object.keys(answers).length, 1)

  // 构建 results 数组：复用评分逻辑计算每道题正确与否
  const results = Object.entries(answers).map(([qid, ua]) => {
    let ok = false
    if (qs && qs.length > 0) {
      const q = qs.find((x: any) => x.id === qid)
      if (q) ok = q.type === "single" ? Number(ua) === (q.answer as any)?.correctIndex : String(ua).trim() === String((q.answer as any)?.value || "").trim()
    } else {
      const ans = PRESET_ANSWERS[qid] || { correctIndex: 0 }
      ok = ans.correctIndex !== undefined ? Number(ua) === ans.correctIndex : String(ua).trim() === String(ans.value || "").trim()
    }
    return { questionId: qid, userAnswer: { value: ua }, isCorrect: ok }
  })

  await supabase.from("PracticeSession").update({ correctCount: c, status: "completed", endedAt: new Date().toISOString() }).eq("id", sessionId)
  return NextResponse.json({ sessionId, correctCount: c, totalQuestions: t, accuracy: Math.round((c / t) * 100), results })
}
