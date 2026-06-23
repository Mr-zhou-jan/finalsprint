"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react"
import Link from "next/link"

export default function MaterialReviewPage() {
  const { projectId, materialId } = useParams() as { projectId: string; materialId: string }
  const router = useRouter()
  const [material, setMaterial] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
      const m = (d.project?.materials || []).find((m: any) => m.id === materialId)
      setMaterial(m || null); setLoading(false)
    }).catch(() => setLoading(false))
  }, [projectId, materialId])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!material) return <div className="p-12 text-center text-zinc-500">资料未找到</div>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="w-4 h-4" />返回战情室
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />{material.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{material.resourceType}</Badge>
            <Badge variant={material.parseStatus === "success" ? "default" : "outline"}>{material.parseStatus}</Badge>
          </div>
          <p className="text-sm text-zinc-500">资料已上传成功。AI 解析功能即将上线，届时系统会自动提取考点。</p>
          <p className="text-xs text-zinc-400 bg-zinc-50 p-3 rounded-xl">
            {material.rawText ? material.rawText.substring(0, 200) + (material.rawText.length > 200 ? "…" : "") : "暂无文本内容"}
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/materials/upload`)}>上传更多</Button>
            <Button onClick={() => router.push(`/projects/${projectId}/analysis`)} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />完成，去生成考点
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
