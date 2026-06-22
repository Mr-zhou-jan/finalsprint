"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { PlusCircle, Zap, ChevronRight, Clock, Target, BookOpen } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => {
      if (d.projects) setProjects(d.projects)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">我的考试项目</h1><p className="text-zinc-500 text-sm mt-1">选择一个项目继续冲刺</p></div>
        <Link href="/projects/new"><Button className="gap-2"><PlusCircle className="w-4 h-4" />新建项目</Button></Link>
      </div>
      {loading && <div className="text-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      {!loading && projects.length === 0 && (
        <Card className="text-center py-12 border-dashed">
          <CardContent><Zap className="w-12 h-12 text-zinc-300 mx-auto mb-4" /><CardTitle className="text-xl mb-2">还没有考试项目</CardTitle><CardDescription>创建你的第一个期末冲刺项目</CardDescription><Link href="/projects/new" className="mt-6 inline-block"><Button className="gap-2"><PlusCircle className="w-4 h-4" />创建项目</Button></Link></CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {projects.map(p => {
          const daysLeft = Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000))
          return (
            <Link key={p.id} href={`/projects/${p.id}/overview`}>
              <Card className="hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shrink-0"><BookOpen className="w-6 h-6 text-orange-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg">{p.subjectName}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />目标 {p.targetScore} 分</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />剩余 {daysLeft} 天</span>
                      {p.predictedMin && <span className="text-orange-600 font-semibold">估分 {p.predictedMin}~{p.predictedMax}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
