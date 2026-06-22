"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DiagnosticTakePage() {
  const { projectId } = useParams() as { projectId: string }
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [diagnosticId, setDiagnosticId] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/projects/${projectId}/diagnostic/generate`, { method: "POST" }).then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return }
      setQuestions(d.questions || []); setDiagnosticId(d.diagnosticId); setLoading(false)
    }).catch(() => { setError("生成失败"); setLoading(false) })
  }, [projectId])

  const handleSubmit = async () => {
    const unanswered = questions.length - Object.keys(answers).length
    if (unanswered > 0 && !confirm(`还有 ${unanswered} 题未作答，确定提交吗？`)) return
    setSubmitting(true)
    const res = await fetch(`/api/projects/${projectId}/diagnostic/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ diagnosticId, answers }) })
    const data = await res.json()
    if (data.error) { setError(data.error); setSubmitting(false); return }
    router.push(`/projects/${projectId}/diagnostic/report?diagnosticId=${diagnosticId}`)
  }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (error) return <div className="p-12 text-center"><AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" /><p className="text-red-500 mb-4">{error}</p><Button onClick={() => window.location.reload()}>重试</Button></div>

  const q = questions[currentIdx]; if (!q) return null
  const progress = ((currentIdx + 1) / questions.length) * 100

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 mb-4"><ArrowLeft className="w-4 h-4" />返回</Link>
      <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-zinc-400">摸底诊断 · 第 {currentIdx + 1}/{questions.length} 题</span><span className="text-xs text-zinc-400">已答 {Object.keys(answers).length}/{questions.length}</span></div>
      <Progress value={progress} className="mb-6 h-2" />
      <div className="card-glass p-6 mb-4">
        <p className="text-xs text-zinc-400 mb-1">{q.examPointTitle}</p>
        <p className="font-bold text-lg mb-4">{q.stem}</p>
        {q.type === "single" && <div className="space-y-2">{(q.options || []).map((opt: string, i: number) => {
          const sel = answers[String(currentIdx)] === String(i)
          return <button key={i} onClick={() => setAnswers(a => ({ ...a, [String(currentIdx)]: String(i) }))} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${sel ? "border-orange-400 bg-orange-50" : "border-zinc-100 hover:border-zinc-300"}`}>{String.fromCharCode(65 + i)}. {opt}</button>
        })}</div>}
        {(q.type === "fill" || q.type === "calc") && <input type="text" value={answers[String(currentIdx)] || ""} onChange={e => setAnswers(a => ({ ...a, [String(currentIdx)]: e.target.value }))} placeholder="输入你的答案…" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-orange-400" autoComplete="off" />}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}>上一题</Button>
        {currentIdx < questions.length - 1 ? <Button className="flex-1" onClick={() => setCurrentIdx(i => i + 1)}>下一题</Button> : <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>{submitting ? "提交中…" : "提交诊断"}</Button>}
      </div>
    </div>
  )
}
