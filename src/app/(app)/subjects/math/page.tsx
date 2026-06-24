"use client"

import Link from "next/link"
import { SUBJECTS_CONFIG } from "@/data/subjects/subjects-config"
import { mathKnowledgePoints, mathCrashCourse, mathQuestions, mathSprintPlan, mathErrors } from "@/data/subjects"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Zap, Map, PenLine, Calendar, BookOpen, TrendingUp, ArrowRight, Sigma } from "lucide-react"
import type { SubjectConfig } from "@/data/subjects/subject-types"

const config: SubjectConfig = {
  ...SUBJECTS_CONFIG.math,
  knowledgePoints: mathKnowledgePoints, crashCourseBlocks: mathCrashCourse,
  practiceQuestions: mathQuestions, sprintPlanDays: mathSprintPlan, errorRecords: mathErrors,
}

const mastered = mathKnowledgePoints.filter(p => p.masteryLevel >= 3).length
const total = mathKnowledgePoints.length
const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

export default function MathHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* 高数专属横幅 */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link href="/subjects" className="text-blue-200 hover:text-white text-sm inline-flex items-center gap-1 mb-3 transition-colors">← 学科总站</Link>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">∫</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">高等数学</h1>
              <p className="text-blue-100 mt-1">期末考试 · 考研数学 — 从极限到微分方程，公式即武器</p>
            </div>
            <div className="flex gap-3">
              <Link href="/subjects/math/crash"><Button className="bg-white text-blue-700 hover:bg-blue-50 gap-1.5 shadow-lg"><Zap className="w-4 h-4" />开始速通</Button></Link>
              <Link href="/subjects/math/practice"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-1.5"><PenLine className="w-4 h-4" />刷题</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "考点总数", value: total, icon: Target, color: "text-blue-600 bg-blue-100" },
            { label: "知识板块", value: config.knowledgeDomains.length, icon: BookOpen, color: "text-cyan-600 bg-cyan-100" },
            { label: "练习题", value: mathQuestions.length, icon: PenLine, color: "text-indigo-600 bg-indigo-100" },
            { label: "掌握率", value: `${pct}%`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-100" },
          ].map((s, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-zinc-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        {/* 进度条 */}
        <Card className="border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Sigma className="w-4 h-4 text-blue-600" />复习进度</h3>
              <Badge variant="secondary">{mastered}/{total} 考点已掌握</Badge>
            </div>
            <Progress value={pct} className="h-2.5" />
            <p className="text-xs text-zinc-400 mt-2">已掌握 {pct}% · 建议每天 60 分钟 · 预计 7 天完成一轮速通</p>
          </CardContent>
        </Card>

        {/* 6 模块入口 */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-blue-600" />学习模块</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "/subjects/math/materials", icon: BookOpen, label: "资料中心", desc: "上传教材/真题", color: "border-l-green-400" },
              { href: "/subjects/math/scope", icon: Map, label: "考纲地图", desc: `${total} 个考点`, color: "border-l-blue-400" },
              { href: "/subjects/math/crash", icon: Zap, label: "速通讲义", desc: `${mathCrashCourse.length} 节速通课`, color: "border-l-orange-400" },
              { href: "/subjects/math/practice", icon: PenLine, label: "刷题战场", desc: `${mathQuestions.length} 道精选`, color: "border-l-red-400" },
              { href: "/subjects/math/sprint", icon: Calendar, label: "冲刺计划", desc: "7 天冲刺", color: "border-l-purple-400" },
              { href: "/subjects/math/review", icon: Target, label: "回炉中心", desc: `${mathErrors.length} 道错题`, color: "border-l-pink-400" },
            ].map((mod, i) => (
              <Link key={i} href={mod.href}>
                <Card className={`border-l-4 ${mod.color} hover:shadow-md transition-all cursor-pointer h-full`}>
                  <CardContent className="p-4">
                    <mod.icon className="w-5 h-5 text-zinc-600 mb-2" />
                    <p className="font-semibold text-sm">{mod.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{mod.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 速通策略卡 */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">💡 高数速通策略</h3>
                <p className="text-sm text-zinc-600 mb-1">{config.knowledgeDomains.length} 大板块 · {total} 个考点 — 极限+导数+积分占 60% 分值</p>
                <p className="text-xs text-zinc-400">建议顺序：极限 → 导数 → 积分 → 微分方程 → 中值定理</p>
              </div>
              <Link href="/subjects/math/crash"><Button className="gap-1.5">进入速通 <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
