"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, BookOpen } from "lucide-react"
import Link from "next/link"

const ERROR_LABELS: Record<string, string> = { concept: "概念不清", formula: "公式记错", careless: "审题失误", no_idea: "完全不会" }

export default function ErrorBookPage() {
  const { projectId } = useParams() as { projectId: string }
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true)
  const load = () => { fetch(`/api/projects/${projectId}/errors`).then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { load() }, [projectId])
  const handleResolve = async (errorId: string) => { await fetch(`/api/projects/${projectId}/errors/${errorId}`, { method: "PATCH" }); load() }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  const { totalErrors, unresolvedErrors, groupedByPoint } = data || {}

  return <div className="p-6 max-w-3xl mx-auto space-y-6">
    <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500"><ArrowLeft className="w-4 h-4" />返回战情室</Link>
    <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">错题回炉</h1><p className="text-zinc-500 text-sm">{totalErrors || 0} 道错题 · {unresolvedErrors || 0} 道待解决</p></div></div>
    {(!groupedByPoint || groupedByPoint.length === 0) ? (
      <Card className="text-center py-12"><CardContent><CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" /><p className="font-bold text-lg mb-2">还没有错题 🎉</p><p className="text-zinc-500 mb-4">继续保持！</p><Link href={`/projects/${projectId}/practice`}><Button>去刷题</Button></Link></CardContent></Card>
    ) : (
      <div className="space-y-6">{groupedByPoint.map((group: any) => <div key={group.examPointId}><div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-orange-500" /><h2 className="font-bold">{group.examPointTitle}</h2><Badge variant="secondary">{group.unresolved}/{group.total} 待解决</Badge></div><div className="space-y-2">{group.items.map((item: any) => <Card key={item.id} className={item.status === "resolved" ? "opacity-60" : "border-red-200"}><CardContent className="p-4"><div className="flex items-start justify-between mb-2"><Badge variant="outline" className="text-xs">{ERROR_LABELS[item.errorReason] || item.errorReason}</Badge>{item.status === "resolved" ? <Badge className="bg-emerald-100 text-emerald-700">已解决</Badge> : <Button size="sm" variant="outline" onClick={() => handleResolve(item.id)}>标记解决</Button>}</div><p className="text-sm font-medium mb-2">{item.questionStem}</p><div className="grid grid-cols-2 gap-2 text-xs"><div className="p-2 bg-red-50 rounded"><span className="text-red-500">你的：</span>{String(item.userAnswer?.value || "")}</div><div className="p-2 bg-emerald-50 rounded"><span className="text-emerald-600">正确：</span>{item.correctAnswer?.correctIndex !== undefined ? String.fromCharCode(65 + item.correctAnswer.correctIndex) : item.correctAnswer?.value}</div></div>{item.recommendedAction && <p className="text-xs text-orange-600 mt-2">💡 {item.recommendedAction}</p>}</CardContent></Card>)}</div></div>)}</div>
    )}
  </div>
}
