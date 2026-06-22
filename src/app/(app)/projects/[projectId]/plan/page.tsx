"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Clock, TrendingUp, BookOpen, PenLine, RotateCw } from "lucide-react"
import Link from "next/link"

const TYPE_ICONS: Record<string, any> = { learn: BookOpen, practice: PenLine, review: RotateCw, mock: Clock }
const REASON_LABELS: Record<string, string> = { weak_point: "薄弱", high_roi: "高收益", exam_hotspot: "高频", error_retry: "错题复发", coverage_gap: "资料缺口" }

export default function PlanPage() {
  const { projectId } = useParams() as { projectId: string }
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const load = () => { setLoading(true); fetch(`/api/projects/${projectId}/plan/today`).then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { load() }, [projectId])

  const handleGenerate = async (tier: string) => { setGenerating(true); await fetch(`/api/projects/${projectId}/plan/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetTier: tier }) }); setGenerating(false); load() }
  const handleStatus = async (taskId: string, status: string) => { await fetch(`/api/projects/${projectId}/plan/tasks/${taskId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); load() }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>

  const tasks = data?.tasks || []
  const highPrio = tasks.filter((t: any) => t.priority <= 2 && t.taskType === "learn")
  const midPrio = tasks.filter((t: any) => t.priority === 2 && t.taskType !== "learn")
  const lowPrio = tasks.filter((t: any) => t.priority >= 3)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft className="w-4 h-4" />返回战情室</Link>
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">冲刺路线</h1><div className="flex gap-2">{[{ k: "pass", v: "保60" }, { k: "75", v: "冲75" }, { k: "85", v: "冲85" }].map(({ k, v }) => <Button key={k} size="sm" variant="outline" onClick={() => handleGenerate(k)} disabled={generating}>{v}</Button>)}</div></div>
      {tasks.length === 0 ? (
        <Card className="text-center py-12"><CardContent><Zap className="w-12 h-12 text-zinc-300 mx-auto mb-4" /><p className="font-bold text-lg mb-2">尚未生成冲刺计划</p><p className="text-zinc-500 mb-4">完成诊断后生成提分路线</p><Button onClick={() => handleGenerate("75")} disabled={generating}>{generating ? "生成中…" : "生成提分路线 →"}</Button></CardContent></Card>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-orange-50"><CardContent className="p-3 text-center"><p className="text-xs">今日任务</p><p className="text-xl font-bold">{tasks.length} 项</p></CardContent></Card>
            <Card className="bg-blue-50"><CardContent className="p-3 text-center"><p className="text-xl font-bold">{data.totalEstimatedMinutes}min</p><p className="text-xs">预计耗时</p></CardContent></Card>
            <Card className="bg-emerald-50"><CardContent className="p-3 text-center"><p className="text-xl font-bold">+{data.totalExpectedGain}</p><p className="text-xs">预计提分</p></CardContent></Card>
          </div>
          {highPrio.length > 0 && <div><h2 className="font-bold text-sm text-red-600 mb-2">🔴 高优先</h2><div className="space-y-2">{highPrio.map((t: any) => <TaskCard key={t.id} t={t} onStatus={handleStatus} />)}</div></div>}
          {midPrio.length > 0 && <div><h2 className="font-bold text-sm text-amber-600 mb-2">🟡 中优先</h2><div className="space-y-2">{midPrio.map((t: any) => <TaskCard key={t.id} t={t} onStatus={handleStatus} />)}</div></div>}
          {lowPrio.length > 0 && <div><h2 className="font-bold text-sm text-zinc-400 mb-2">⚪ 可延后</h2><div className="space-y-2">{lowPrio.map((t: any) => <TaskCard key={t.id} t={t} onStatus={handleStatus} />)}</div></div>}
          <div className="text-center text-sm text-zinc-500">今日完成后预计估分：<span className="font-bold text-orange-600">{data.predictedAfterToday} 分</span></div>
        </>
      )}
    </div>
  )
}

function TaskCard({ t, onStatus }: { t: any; onStatus: (id: string, s: string) => void }) {
  const Icon = TYPE_ICONS[t.taskType] || BookOpen
  return <Card className={t.status === "done" ? "opacity-60" : ""}><CardContent className="p-4 flex items-center gap-3">
    <Icon className="w-5 h-5 text-orange-500 shrink-0" />
    <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{t.title}</p><div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5"><span>{t.estimatedMinutes}min</span><span className="text-emerald-600 font-medium">+{t.expectedGain}分</span>{t.sourceReason && <Badge variant="secondary" className="text-[10px]">{REASON_LABELS[t.sourceReason] || t.sourceReason}</Badge>}</div></div>
    {t.status === "done" ? <Badge className="bg-emerald-100 text-emerald-700">✓ 完成</Badge> : <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => onStatus(t.id, "done")}>完成</Button><Button size="sm" variant="ghost" className="text-zinc-400" onClick={() => onStatus(t.id, "skipped")}>跳过</Button></div>}
  </CardContent></Card>
}
