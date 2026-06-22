"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, AlertTriangle, BookOpen, PenLine, Zap } from "lucide-react"
import Link from "next/link"

export default function SprintCardPage() {
  const { projectId, pointId } = useParams() as { projectId: string; pointId: string }
  const router = useRouter()
  const [point, setPoint] = useState<any>(null); const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
      setPoint(d.project?.examPoints?.find((p: any) => p.id === pointId) || null); setLoading(false)
    }).catch(() => setLoading(false))
  }, [projectId, pointId])

  const handleStartPractice = async () => {
    const res = await fetch(`/api/projects/${projectId}/practice/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ examPointId: pointId, count: 5 }) })
    const data = await res.json()
    if (data.sessionId) router.push(`/projects/${projectId}/practice?sessionId=${data.sessionId}`)
  }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!point) return <div className="p-12 text-center text-zinc-500">考点不存在</div>

  return <div className="p-6 max-w-3xl mx-auto space-y-6">
    <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft className="w-4 h-4" />返回</Link>
    <div className="flex items-start justify-between"><div><div className="flex items-center gap-2 mb-1"><Badge variant="secondary">{point.importanceTier === "must" ? "必学" : point.importanceTier === "important" ? "重要" : "可选"}</Badge><Badge variant="outline" className="text-orange-600">{(point.hitRate ?? 0) * 100}% 出现</Badge></div><h1 className="text-2xl font-bold">{point.title}</h1><p className="text-sm text-zinc-500 mt-1">占分 {point.estimatedScoreMin}~{point.estimatedScoreMax} · 约需 {point.avgStudyMinutes || "--"} min</p></div><div className="text-center"><p className="text-3xl font-bold text-orange-600">{point.confidenceScore}%</p><p className="text-xs">掌握度</p></div></div>
    <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" />怎么考</CardTitle></CardHeader><CardContent><p className="text-sm text-zinc-600">常见出题：{(point.commonPatterns as any[])?.join("、") || "选择/填空/计算"}</p></CardContent></Card>
    {point.formulas && (point.formulas as any[]).length > 0 && <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" />必背公式 ({(point.formulas as any[]).length}条)</CardTitle></CardHeader><CardContent className="space-y-2">{(point.formulas as any[]).map((f: any, i: number) => <div key={i} className="p-3 bg-zinc-50 rounded-xl"><p className="font-mono font-bold text-sm">{f.latex || f.name}</p><p className="text-xs text-zinc-500">{f.note}</p></div>)}</CardContent></Card>}
    {point.solvingTemplate && (point.solvingTemplate as any[]).length > 0 && <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><PenLine className="w-4 h-4 text-purple-500" />解题模板</CardTitle></CardHeader><CardContent><ol className="list-decimal list-inside text-sm text-zinc-700 space-y-1">{(point.solvingTemplate as string[]).map((s: string, i: number) => <li key={i}>{s}</li>)}</ol></CardContent></Card>}
    {point.traps && (point.traps as any[]).length > 0 && <Card className="border-red-200"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-red-700"><AlertTriangle className="w-4 h-4" />高频陷阱</CardTitle></CardHeader><CardContent className="space-y-2">{(point.traps as string[]).map((t: string, i: number) => <div key={i} className="p-3 bg-red-50 rounded-xl text-sm text-red-700">⚠️ {t}</div>)}</CardContent></Card>}
    <Card className="border-orange-300 bg-orange-50/50"><CardContent className="p-6 text-center"><Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" /><p className="font-bold text-lg mb-1">准备开始练习？</p><p className="text-sm text-zinc-500 mb-4">5 道题 · 即时批改 · 错题自动入库</p><Button size="lg" onClick={handleStartPractice} className="gap-2"><Zap className="w-4 h-4" />开始练习（5题）</Button></CardContent></Card>
  </div>
}
