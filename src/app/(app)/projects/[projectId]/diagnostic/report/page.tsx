"use client"
import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, TrendingUp, ShieldAlert, Target, Zap } from "lucide-react"
import Link from "next/link"

function ReportInner() {
  const { projectId } = useParams() as { projectId: string }
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${projectId}/dashboard`).then(r => r.json()).then(d => { setReport(d); setLoading(false) }).catch(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!report) return <div className="p-12 text-center text-zinc-500">诊断数据加载失败</div>

  const { currentScore, targetScore, scoreGap, passProbability, targetProbability, topOpportunities, warnings } = report

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft className="w-4 h-4" />返回战情室</Link>
      <h1 className="text-2xl font-bold">摸底诊断结果</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-orange-50 border-orange-200"><CardContent className="p-4 text-center"><p className="text-sm text-orange-600 mb-1">当前估分</p><p className="text-3xl font-bold text-orange-700">{currentScore?.min}~{currentScore?.max}</p><p className="text-xs text-orange-500">目标 {targetScore} · 差距 {scoreGap}</p></CardContent></Card>
        <Card className={passProbability >= 0.7 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}><CardContent className="p-4 text-center"><ShieldAlert className={`w-6 h-6 mx-auto mb-1 ${passProbability >= 0.7 ? "text-emerald-500" : "text-red-500"}`} /><p className="text-2xl font-bold">{Math.round(passProbability * 100)}%</p><p className="text-xs">保过概率</p></CardContent></Card>
        <Card className={targetProbability >= 0.5 ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}><CardContent className="p-4 text-center"><Target className={`w-6 h-6 mx-auto mb-1 ${targetProbability >= 0.5 ? "text-blue-500" : "text-amber-500"}`} /><p className="text-2xl font-bold">{Math.round(targetProbability * 100)}%</p><p className="text-xs">达标概率</p></CardContent></Card>
      </div>
      {topOpportunities?.length > 0 && <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" />最值得优先补的考点</h2>
        <div className="space-y-2">{topOpportunities.map((opp: any, i: number) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-4"><span className="text-2xl">{["🥇","🥈","🥉"][i]||"📌"}</span><div className="flex-1"><p className="font-bold">{opp.examPointTitle}</p><p className="text-xs text-zinc-500">掌握 {opp.currentMastery}% · {opp.estimatedMinutes}min · +{opp.expectedGain}分 · {(opp.reasonTags||[]).join("·")}</p></div></CardContent></Card>
        ))}</div>
      </div>}
      {warnings?.length > 0 && <Card className="border-red-200 bg-red-50/50"><CardContent className="p-4"><h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />冲刺风险提示</h3><ul className="space-y-1">{warnings.map((w: string, i: number) => <li key={i} className="text-sm text-red-600">• {w}</li>)}</ul></CardContent></Card>}
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/diagnostic/take`)}>重新诊断</Button>
        <Button onClick={() => router.push(`/projects/${projectId}/plan`)} className="gap-2">生成提分路线 <TrendingUp className="w-4 h-4" /></Button>
      </div>
    </div>
  )
}

export default function DiagnosticReportPage() {
  return <Suspense fallback={<div className="p-12 text-center">加载中…</div>}><ReportInner /></Suspense>
}
