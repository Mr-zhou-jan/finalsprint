"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Brain, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AnalysisPage() {
  const { projectId } = useParams() as { projectId: string }
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tier, setTier] = useState<string>("all")

  const load = () => {
    setLoading(true)
    fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
      setProject(d.project || d); setLoading(false)
    }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [projectId])

  const handleGenerate = async () => {
    setGenerating(true)
    const materials = project?.materials || []
    if (materials.length === 0) {
      const titles = ["基本概念", "公式与定理", "常见题型", "典型例题", "易错点"]
      for (const t of titles) {
        await fetch(`/api/projects/${projectId}/exam-points/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: t }),
        }).catch(() => {})
      }
    } else {
      for (const m of materials.slice(0, 5)) {
        await fetch(`/api/projects/${projectId}/exam-points/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materialId: m.id, name: m.title }),
        }).catch(() => {})
      }
    }
    setGenerating(false)
    load()
  }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!project) return <div className="p-12 text-center text-zinc-500">项目不存在</div>

  const points = project.examPoints || []
  const filtered = tier === "all" ? points : points.filter((p: any) => p.targetTier === tier)
  const mustCount = points.filter((p: any) => p.importanceTier === "must" || p.targetTier === "pass").length
  const totalEstMin = points.reduce((s: number, p: any) => s + (p.avgStudyMinutes || 0), 0)
  const mastered = points.filter((p: any) => p.masteryStatus === "good").length

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="w-4 h-4" />返回战情室
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">考情分析</h1>
          <p className="text-zinc-500 text-sm">{project.subjectName} · {points.length} 个考点</p>
        </div>
        {points.length === 0 && (
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            <Brain className="w-4 h-4" />{generating ? "生成中…" : "生成考点"}
          </Button>
        )}
      </div>

      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
        {[
          { k: "all", v: `全部 (${points.length})` },
          { k: "pass", v: "保60" },
          { k: "75", v: "冲75" },
          { k: "85", v: "冲85" },
        ].map(t => (
          <button key={t.k} onClick={() => setTier(t.k)}
            className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all", tier === t.k ? "bg-white shadow-sm text-orange-700" : "text-zinc-500 hover:text-zinc-700")}>
            {t.v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-orange-600">{points.length}</p><p className="text-xs text-zinc-500">考点总数</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-emerald-600">{mastered}</p><p className="text-xs text-zinc-500">已掌握</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-orange-600">{mustCount}</p><p className="text-xs text-zinc-500">必学考点</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-blue-600">~{totalEstMin}min</p><p className="text-xs text-zinc-500">总耗时</p></CardContent></Card>
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="font-bold text-lg mb-1">暂无考点数据</p>
            <p className="text-zinc-500 text-sm mb-4">请先上传资料或点击上方生成考点</p>
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              <Zap className="w-4 h-4" />{generating ? "生成中…" : "生成考点"}
            </Button>
          </CardContent>
        </Card>
      )}

      {filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((pt: any) => (
            <Link key={pt.id} href={`/projects/${projectId}/points/${pt.id}`}>
              <Card className="hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={pt.importanceTier === "must" ? "default" : pt.importanceTier === "important" ? "secondary" : "outline"} className="text-[10px]">
                        {pt.importanceTier === "must" ? "必学" : pt.importanceTier === "important" ? "重要" : "可选"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-orange-600">{Math.round((pt.hitRate || 0.5) * 100)}% 考频</Badge>
                      <span className="text-xs text-zinc-400">{pt.estimatedScoreMin || "--"}~{pt.estimatedScoreMax || "--"}分</span>
                    </div>
                    <p className="font-semibold text-sm">{pt.title}</p>
                    {pt.summary && <p className="text-xs text-zinc-400 mt-0.5 truncate">{pt.summary}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-orange-600">{pt.confidenceScore}%</p>
                    <p className="text-xs text-zinc-400">掌握</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {points.length > 0 && (
        <div className="flex gap-3 justify-center pt-4">
          <Link href={`/projects/${projectId}/practice`}><Button variant="outline" className="gap-2"><Brain className="w-4 h-4" />按考点刷题</Button></Link>
          <Link href={`/projects/${projectId}/plan`}><Button className="gap-2"><TrendingUp className="w-4 h-4" />生成提分路线</Button></Link>
        </div>
      )}
    </div>
  )
}
