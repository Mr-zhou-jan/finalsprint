import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id: pid } = await params; const { sessionId, answers } = await req.json()
  const ids = Object.keys(answers); if (!ids.length) return NextResponse.json({ error:"无答案" }, { status:400 })
  const { data: qs } = await supabase.from("PracticeQuestion").select("*").in("id", ids)

  // 预设题目答案字典
  const PRESET_ANSWERS: Record<string, { correctIndex?: number; value?: string }> = {
    "preset-0": { correctIndex: 0 }, "preset-1": { correctIndex: 0 }, "preset-2": { correctIndex: 2 },
    "preset-3": { correctIndex: 1 }, "preset-4": { correctIndex: 1 }, "preset-5": { correctIndex: 1 },
    "preset-6": { correctIndex: 1 }, "preset-7": { correctIndex: 0 }, "preset-8": { correctIndex: 1 },
    "preset-9": { correctIndex: 2 },
  }

  let c = 0, ts = 0, es = 0

  if (qs && qs.length > 0) {
    for (const q of qs) {
      const ua = answers[q.id] || ""
      const qv = q.scoreValue || 5; ts += qv
      const ok = q.type === "single" ? Number(ua) === (q.answer as any)?.correctIndex : String(ua).trim() === String((q.answer as any)?.value || "").trim()
      if (ok) { c++; es += qv }
      await supabase.from("QuestionAttempt").insert({ userId: user.id, projectId: pid, questionId: q.id, sessionId, userAnswer: { value: ua }, isCorrect: ok })
    }
  } else {
    // 预设题评分
    for (const [qid, ua] of Object.entries(answers)) {
      const ans = PRESET_ANSWERS[qid] || { correctIndex: 0 }
      const qv = 5; ts += qv
      const ok = ans.correctIndex !== undefined ? Number(ua) === ans.correctIndex : String(ua).trim() === String(ans.value || "").trim()
      if (ok) { c++; es += qv }
    }
  }

  const pct = ts > 0 ? Math.round((es / ts) * 100) : 0
  const pMin = Math.max(0, pct - 10), pMax = Math.min(100, pct + 5)
  await supabase.from("PracticeSession").update({ correctCount: c, status: "completed", endedAt: new Date().toISOString(), resultJson: { scorePercent: pct, totalScore: ts, earnedScore: es } }).eq("id", sessionId)
  if (pMin || pMax) await supabase.from("Project").update({ predictedMin: pMin, predictedMax: pMax }).eq("id", pid)
  return NextResponse.json({ correctCount: c, totalQuestions: Object.keys(answers).length, totalScore: ts, earnedScore: es, scorePercent: pct, predictedMin: pMin, predictedMax: pMax, sprintAdvice: {} })
}