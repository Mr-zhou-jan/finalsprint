"use client"

import Link from "next/link"
import { SUBJECTS_CONFIG } from "@/data/subjects/subjects-config"
import { mechanicsKnowledgePoints, mechanicsCrashCourse, mechanicsQuestions, mechanicsSprintPlan, mechanicsErrors } from "@/data/subjects"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Zap, Map, PenLine, Calendar, BookOpen, TrendingUp, ArrowRight, Wrench } from "lucide-react"
import type { SubjectConfig } from "@/data/subjects/subject-types"

const config: SubjectConfig = {
  ...SUBJECTS_CONFIG.mechanics,
  knowledgePoints: mechanicsKnowledgePoints, crashCourseBlocks: mechanicsCrashCourse,
  practiceQuestions: mechanicsQuestions, sprintPlanDays: mechanicsSprintPlan, errorRecords: mechanicsErrors,
}

const mastered = mechanicsKnowledgePoints.filter(p => p.masteryLevel >= 3).length
const total = mechanicsKnowledgePoints.length
const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

export default function MechanicsHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link href="/subjects" className="text-amber-200 hover:text-white text-sm inline-flex items-center gap-1 mb-3 transition-colors">← 学科总站</Link>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">⚙</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">工程力学</h1>
              <p className="text-amber-100 mt-1">期末考试 — 从受力分析到强度校核，画对图就赢了一半</p>
            </div>
            <div className="flex gap-3">
              <Link href="/subjects/mechanics/crash"><Button className="bg-white text-amber-700 hover:bg-amber-50 gap-1.5 shadow-lg"><Zap className="w-4 h-4" />开始速通</Button></Link>
              <Link href="/subjects/mechanics/practice"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-1.5"><PenLine className="w-4 h-4" />刷题</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "考点总数", value: total, icon: Target, color: "text-amber-600 bg-amber-100" },
            { label: "知识板块", value: config.knowledgeDomains.length, icon: BookOpen, color: "text-orange-600 bg-orange-100" },
            { label: "练习题", value: mechanicsQuestions.length, icon: PenLine, color: "text-yellow-600 bg-yellow-100" },
            { label: "掌握率", value: `${pct}%`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-100" },
          ].map((s, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-zinc-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Card className="border-amber-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-600" />复习进度</h3>
              <Badge variant="secondary">{mastered}/{total} 考点已掌握</Badge>
            </div>
            <Progress value={pct} className="h-2.5" />
            <p className="text-xs text-zinc-400 mt-2">已掌握 {pct}% · 建议每天 60 分钟 · 预计 7 天完成一轮</p>
          </CardContent>
        </Card>

        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-amber-600" />学习模块</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "/subjects/mechanics/materials", icon: BookOpen, label: "资料中心", desc: "上传教材/真题" },
              { href: "/subjects/mechanics/scope", icon: Map, label: "考纲地图", desc: `${total} 个考点` },
              { href: "/subjects/mechanics/crash", icon: Zap, label: "速通讲义", desc: `${mechanicsCrashCourse.length} 节速通课` },
              { href: "/subjects/mechanics/practice", icon: PenLine, label: "刷题战场", desc: `${mechanicsQuestions.length} 道精选` },
              { href: "/subjects/mechanics/sprint", icon: Calendar, label: "冲刺计划", desc: "7 天冲刺" },
              { href: "/subjects/mechanics/review", icon: Target, label: "回炉中心", desc: `${mechanicsErrors.length} 道错题` },
            ].map((mod, i) => (
              <Link key={i} href={mod.href}>
                <Card className="border-l-4 border-l-amber-400 hover:border-l-amber-500 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <mod.icon className="w-5 h-5 text-amber-600 mb-2" />
                    <p className="font-semibold text-sm">{mod.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{mod.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">💡 工程力学速通策略</h3>
                <p className="text-sm text-zinc-600 mb-1">{config.knowledgeDomains.length} 大板块 · {total} 个考点 — 静力学+材料力学覆盖 90% 分值</p>
                <p className="text-xs text-zinc-400">建议顺序：受力分析 → 平衡方程 → 轴向拉压 → 弯曲内力 → 弯曲应力 → 扭转 → 组合变形</p>
              </div>
              <Link href="/subjects/mechanics/crash"><Button className="gap-1.5 bg-amber-600 hover:bg-amber-700">进入速通 <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
