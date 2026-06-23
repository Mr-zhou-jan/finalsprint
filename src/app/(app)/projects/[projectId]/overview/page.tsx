"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Clock, TrendingUp, AlertTriangle, Zap, Upload, Brain, FileText, BookOpen } from "lucide-react"

export default function ProjectOverviewPage() {
  const { projectId } = useParams() as { projectId: string }
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects/${projectId}`).then(r => r.json()).then(d => {
      setProject(d.project || d); setLoading(false)
    }).catch(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!project) return <div className="p-12 text-center text-zinc-500">项目不存在</div>

  const daysLeft = Math.max(0, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))
  const gap = project.predictedMin ? project.targetScore - (project.predictedMax || project.predictedMin) : null
  const hasMaterials = (project.materials || project.Material || []).length > 0
  const hasExamPoints = (project.examPoints || project.ExamPoint || []).length > 0
  const hasDiagnostic = (project.diagnosticRuns || project.DiagnosticRun || []).length > 0
  const hasPlan = (project.sprintPlan || project.SprintPlan || []).length > 0

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">{project.subjectName}</h1><p className="text-zinc-500 text-sm">战情室</p></div>
        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 px-3 py-1"><Clock className="w-3 h-3 mr-1" />距考试 {daysLeft} 天</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><Target className="w-6 h-6 text-orange-500 mx-auto mb-1" /><p className="text-2xl font-bold">{project.targetScore}<span className="text-sm text-zinc-400">分</span></p><p className="text-xs text-zinc-500">目标</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" /><p className="text-2xl font-bold text-blue-600">{project.predictedMin ? `${project.predictedMin}~${project.predictedMax}` : "--"}</p><p className="text-xs text-zinc-500">估分</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" /><p className="text-2xl font-bold text-red-600">{gap !== null ? (gap > 0 ? `差 ${gap}` : "达标") : "--"}</p><p className="text-xs text-zinc-500">距目标</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Brain className="w-6 h-6 text-purple-500 mx-auto mb-1" /><p className="text-2xl font-bold text-purple-600">{project.examPoints?.length || 0}</p><p className="text-xs text-zinc-500">考点</p></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={hasMaterials ? "border-emerald-200 bg-emerald-50/50" : "border-orange-300 bg-orange-50/50 border-2"}>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Upload className="w-5 h-5" />{hasMaterials ? "✓ 资料已上传" : "Step 1: 上传资料"}</CardTitle><CardDescription>{hasMaterials ? `${project.materials.length} 份资料` : "上传教材 PDF、老师重点、往年题"}</CardDescription></CardHeader>
          <CardContent>{hasMaterials && <div className="space-y-1 mb-3">{project.materials.slice(0, 3).map((m: any) => <div key={m.id} className="flex items-center gap-2 text-xs"><FileText className="w-3 h-3 text-zinc-400" />{m.title}<Badge variant="secondary" className="text-[10px]">{m.parseStatus}</Badge></div>)}</div>}<Link href={`/projects/${projectId}/materials/upload`}><Button variant={hasMaterials ? "outline" : "default"} size="sm" className="w-full">{hasMaterials ? "管理资料" : "上传资料 →"}</Button></Link></CardContent>
        </Card>
        <Card className={hasExamPoints ? "border-emerald-200 bg-emerald-50/50" : hasMaterials ? "border-orange-300 bg-orange-50/50 border-2" : "opacity-50"}>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Brain className="w-5 h-5" />{hasExamPoints ? "✓ 考点已生成" : "Step 2: 考情分析"}</CardTitle><CardDescription>{hasExamPoints ? `${project.examPoints.length} 个考点` : "AI 分析资料生成考点"}</CardDescription></CardHeader>
          <CardContent>{hasExamPoints ? <Link href={`/projects/${projectId}/analysis`}><Button variant="outline" size="sm" className="w-full">查看考点</Button></Link> : <Button size="sm" className="w-full" disabled={!hasMaterials} onClick={() => router.push(`/projects/${projectId}/analysis`)}>生成考点</Button>}</CardContent>
        </Card>
        <Card className={hasDiagnostic ? "border-emerald-200 bg-emerald-50/50" : hasExamPoints ? "border-orange-300 bg-orange-50/50 border-2" : "opacity-50"}>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="w-5 h-5" />{hasDiagnostic ? "✓ 已诊断" : "Step 3: 水平诊断"}</CardTitle><CardDescription>{hasDiagnostic ? `估分 ${project.predictedMin}~${project.predictedMax}` : "10-20 题判断当前水平"}</CardDescription></CardHeader>
          <CardContent>{hasDiagnostic ? <Link href={`/projects/${projectId}/diagnostic/report`}><Button variant="outline" size="sm" className="w-full">查看报告</Button></Link> : <Button size="sm" className="w-full" disabled={!hasExamPoints} onClick={() => router.push(`/projects/${projectId}/diagnostic/take`)}>开始诊断</Button>}</CardContent>
        </Card>
        <Card className={hasPlan ? "border-emerald-200 bg-emerald-50/50" : hasDiagnostic ? "border-orange-300 bg-orange-50/50 border-2" : "opacity-50"}>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="w-5 h-5" />{hasPlan ? "✓ 计划已生成" : "Step 4: 冲刺计划"}</CardTitle><CardDescription>{hasPlan ? "每日作战任务已部署" : "AI 生成每日提分计划"}</CardDescription></CardHeader>
          <CardContent>{hasPlan ? <Link href={`/projects/${projectId}/plan`}><Button variant="outline" size="sm" className="w-full">查看计划</Button></Link> : <Button size="sm" className="w-full" disabled={!hasDiagnostic} onClick={() => router.push(`/projects/${projectId}/plan`)}>生成计划</Button>}</CardContent>
        </Card>
      </div>

      {hasExamPoints && <div className="grid grid-cols-3 gap-3">
        <Link href={`/projects/${projectId}/points`}><Button variant="outline" className="w-full gap-2"><Zap className="w-4 h-4" />考点列表</Button></Link>
        <Link href={`/projects/${projectId}/practice`}><Button variant="outline" className="w-full gap-2"><Target className="w-4 h-4" />刷题练习</Button></Link>
        <Link href={`/projects/${projectId}/errors`}><Button variant="outline" className="w-full gap-2"><AlertTriangle className="w-4 h-4" />错题复盘</Button></Link>
      </div>}
    </div>
  )
}
