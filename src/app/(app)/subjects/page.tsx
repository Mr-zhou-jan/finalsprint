"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, GraduationCap, TrendingUp, Hammer, Ruler, Cpu, Languages, Clock, ArrowRight } from "lucide-react"

/** 学科首页 — 期末速通学科总站 */
const SUBJECTS = [
  { id: "math", name: "高等数学", icon: GraduationCap, color: "from-orange-500 to-red-500", progress: 35, daysLeft: 5, examName: "高等数学（下）", shortName: "高数" },
  { id: "physics", name: "大学物理", icon: TrendingUp, color: "from-blue-500 to-cyan-500", progress: 20, daysLeft: 7, examName: "大学物理（上）", shortName: "大物" },
  { id: "mechanics", name: "工程力学", icon: Hammer, color: "from-yellow-600 to-orange-600", progress: 15, daysLeft: 7, examName: "工程力学", shortName: "力学" },
  { id: "tolerance", name: "互换性测量", icon: Ruler, color: "from-purple-500 to-pink-500", progress: 10, daysLeft: 10, examName: "互换性与测量技术", shortName: "互换性" },
  { id: "cpp", name: "C/C++程序设计", icon: Cpu, color: "from-blue-600 to-indigo-600", progress: 45, daysLeft: 3, examName: "C/C++程序设计", shortName: "C++" },
  { id: "english", name: "大学英语四六级", icon: Languages, color: "from-red-500 to-pink-500", progress: 60, daysLeft: 10, examName: "CET-4 / CET-6", shortName: "英语", link: "/english" },
]

export default function SubjectsHomePage() {
  const router = useRouter()

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* 页面头部 */}
      <div>
        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mb-2">
          <Zap className="w-4 h-4" /> 期末速通系统
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">选择学科</h1>
        <p className="text-zinc-500">选定一门课程，AI 帮你规划最短提分路线</p>
      </div>

      {/* 学科卡片网格 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map(s => (
          <Card
            key={s.id}
            className="group cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-200 overflow-hidden"
            onClick={() => router.push((s as any).link || `/subjects/${s.id}`)}
          >
            <CardContent className="p-0">
              {/* 顶部渐变条 */}
              <div className={`h-2 bg-gradient-to-r ${s.color}`} />

              <div className="p-5 space-y-3">
                {/* 图标 + 名称 */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{s.name}</h3>
                    <p className="text-xs text-zinc-400">{s.examName}</p>
                  </div>
                </div>

                {/* 进度 */}
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span>复习进度</span>
                    <span>{s.progress}%</span>
                  </div>
                  <Progress value={s.progress} className="h-1.5" />
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>距考试 {s.daysLeft} 天</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">未创建任务</Badge>
                </div>

                {/* hover 行动提示 */}
                <div className="flex items-center gap-1 text-xs text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  进入工作台 <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="text-center text-sm text-zinc-400 space-y-1">
        <p>选择一个学科进入 7 模块工作台：资料库 → 考点图 → 速通讲义 → 刷题 → 冲刺计划 → 错题复盘</p>
        <p className="text-xs">已有项目？去 <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => router.push("/projects")}>冲刺项目</span> 继续</p>
      </div>
    </div>
  )
}
