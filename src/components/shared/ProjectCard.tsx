import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Clock, Target, BookOpen } from "lucide-react"

export function ProjectCard({ project }: { project: any }) {
  const daysLeft = Math.max(0, Math.ceil((new Date(project.examDate).getTime() - Date.now()) / 86400000))
  return <Link href={`/projects/${project.id}/overview`}><Card className="hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"><CardContent className="flex items-center gap-4 p-5"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shrink-0"><BookOpen className="w-6 h-6 text-orange-600" /></div><div className="flex-1 min-w-0"><p className="font-bold text-lg">{project.subjectName}</p><div className="flex items-center gap-4 text-xs text-zinc-500 mt-1"><span className="flex items-center gap-1"><Target className="w-3 h-3" />目标 {project.targetScore} 分</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />剩余 {daysLeft} 天</span>{project.predictedMin && <span className="text-orange-600 font-semibold">估分 {project.predictedMin}~{project.predictedMax}</span>}</div></div><ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-orange-500 transition-colors" /></CardContent></Card></Link>
}
