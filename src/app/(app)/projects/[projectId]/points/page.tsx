"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Brain, Zap, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PointsPage() {
  const { projectId } = useParams() as { projectId: string }
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
      setProject(d.project || d); setLoading(false)
    }).catch(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!project) return <div className="p-12 text-center text-zinc-500">项目不存在</div>

  const points = (project.examPoints || []).filter((p: any) =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="w-4 h-4" />返回战情室
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">考点列表</h1>
          <p className="text-zinc-500 text-sm">{project.subjectName} · {project.examPoints?.length || 0} 个考点</p>
        </div>
        <Link href={`/projects/${projectId}/practice`}><Button variant="outline" className="gap-2"><Zap className="w-4 h-4" />刷题练习</Button></Link>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜索考点…"
          className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50" />
      </div>
      {points.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="font-bold text-lg mb-1">{search ? "未找到匹配考点" : "暂无考点"}</p>
            <p className="text-zinc-500 text-sm mb-4">{search ? "换个关键词试试" : "请先完成考情分析"}</p>
            <Link href={`/projects/${projectId}/analysis`}><Button className="gap-2"><Brain className="w-4 h-4" />去考情分析</Button></Link>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {points.map((pt: any) => (
          <Link key={pt.id} href={`/projects/${projectId}/points/${pt.id}`}>
            <Card className="hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={pt.importanceTier === "must" ? "default" : pt.importanceTier === "important" ? "secondary" : "outline"} className="text-[10px]">
                      {pt.importanceTier === "must" ? "必学" : pt.importanceTier === "important" ? "重要" : "可选"}
                    </Badge>
                    <span className="text-xs text-zinc-400">{Math.round((pt.hitRate || 0.5) * 100)}% 考频</span>
                    <span className="text-xs text-zinc-400">| {pt.estimatedScoreMin || "--"}~{pt.estimatedScoreMax || "--"}分</span>
                  </div>
                  <p className="font-semibold text-sm">{pt.title}</p>
                  {pt.summary && <p className="text-xs text-zinc-400 mt-0.5 truncate">{pt.summary}</p>}
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("px-3 py-1 rounded-full text-xs font-bold", pt.confidenceScore >= 70 ? "bg-emerald-100 text-emerald-700" : pt.confidenceScore >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                    {pt.confidenceScore || 0}%
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">掌握度</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
