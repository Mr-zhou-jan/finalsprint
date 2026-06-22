"use client"
import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle, Zap } from "lucide-react"
import Link from "next/link"

function PracticeInner() {
  const { projectId } = useParams() as { projectId: string }
  const sp = useSearchParams(); const router = useRouter()
  const sessionId = sp.get("sessionId") || ""
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<any[] | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [score, setScore] = useState<any>(null)

  const handleStart = async () => {
    setLoading(true)
    const dRes = await fetch(`/api/projects/${projectId}/dashboard`); const dash = await dRes.json()
    const pid = dash.topOpportunities?.[0]?.examPointId
    if (!pid) { setLoading(false); return }
    const res = await fetch(`/api/projects/${projectId}/practice/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ examPointId: pid, count: 5 }) })
    const data = await res.json()
    setQuestions(data.questions || []); setAnswers({}); setResults(null); setCurrentIdx(0); setScore(null); setLoading(false)
    router.replace(`/projects/${projectId}/practice?sessionId=${data.sessionId}`)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const ansObj: Record<string, string> = {}
    questions.forEach((q, i) => { if (answers[String(i)]) ansObj[q.id] = answers[String(i)] })
    const res = await fetch(`/api/projects/${projectId}/practice/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, answers: ansObj }) })
    const data = await res.json(); setResults(data.results || []); setScore(data); setSubmitting(false)
  }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>

  if (!sessionId || questions.length === 0) {
    return <div className="p-6 max-w-lg mx-auto text-center pt-20"><Zap className="w-16 h-16 text-orange-300 mx-auto mb-4" /><h1 className="text-2xl font-bold mb-2">专项刷题</h1><p className="text-zinc-500 mb-6">从最薄弱考点开始，即时批改，错题自动入库。</p><Button size="lg" onClick={handleStart} className="gap-2">开始刷题 →</Button></div>
  }

  if (results) {
    return <div className="p-6 max-w-2xl mx-auto space-y-6"><h1 className="text-2xl font-bold">练习结果</h1>
      <Card className={score?.accuracy >= 80 ? "bg-emerald-50" : score?.accuracy >= 50 ? "bg-amber-50" : "bg-red-50"}><CardContent className="p-6 text-center"><p className="text-4xl font-bold">{score?.accuracy}%</p><p className="text-sm mt-1">{score?.correctCount}/{score?.totalQuestions} 正确</p></CardContent></Card>
      <div className="space-y-3">{results.map((r: any, i: number) => {
        const q = questions.find(qq => qq.id === r.questionId)
        return <Card key={i} className={r.isCorrect ? "border-emerald-200" : "border-red-200"}><CardContent className="p-4"><div className="flex items-start gap-3">{r.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}<div className="flex-1"><p className="text-sm font-medium">{q?.stem}</p><p className="text-xs mt-2"><span className="text-red-500">你的答案：</span>{String(r.userAnswer?.value || "")}</p><p className="text-xs"><span className="text-emerald-600">正确答案：</span>{r.correctAnswer?.correctIndex !== undefined ? String.fromCharCode(65 + r.correctAnswer.correctIndex) : r.correctAnswer?.value}</p></div></div></CardContent></Card>
      })}</div>
      <div className="flex gap-3 justify-center"><Button variant="outline" onClick={() => { setQuestions([]); setResults(null); router.push(`/projects/${projectId}/practice`) }}>重新选择</Button><Link href={`/projects/${projectId}/errors`}><Button variant="outline">查看错题本</Button></Link></div></div>
  }

  const q = questions[currentIdx]; if (!q) return null
  return <div className="p-6 max-w-2xl mx-auto"><Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 mb-4"><ArrowLeft className="w-4 h-4" />返回</Link>
    <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-zinc-400">专项练习 · 第 {currentIdx + 1}/{questions.length} 题</span></div><Progress value={((currentIdx + 1) / questions.length) * 100} className="mb-6 h-2" />
    <Card><CardContent className="p-6"><p className="font-bold text-lg mb-4">{q.stem}</p>
      {q.type === "single" && <div className="space-y-2">{(q.options as string[] || []).map((opt: string, i: number) => {
        const sel = answers[String(currentIdx)] === String(i)
        return <button key={i} onClick={() => setAnswers(a => ({ ...a, [String(currentIdx)]: String(i) }))} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${sel ? "border-orange-400 bg-orange-50" : "border-zinc-100 hover:border-zinc-300"}`}>{String.fromCharCode(65 + i)}. {opt}</button>
      })}</div>}
      {(q.type === "fill" || q.type === "calculation") && <input type="text" value={answers[String(currentIdx)] || ""} onChange={e => setAnswers(a => ({ ...a, [String(currentIdx)]: e.target.value }))} placeholder="输入你的答案…" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-orange-400" autoComplete="off" />}
    </CardContent></Card>
    <div className="flex gap-3 mt-4"><Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}>上一题</Button>{currentIdx < questions.length - 1 ? <Button className="flex-1" onClick={() => setCurrentIdx(i => i + 1)}>下一题</Button> : <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>{submitting ? "提交中…" : "提交练习"}</Button>}</div></div>
}

export default function PracticePage() {
  return <Suspense fallback={<div className="p-12 text-center">加载中…</div>}><PracticeInner /></Suspense>
}
