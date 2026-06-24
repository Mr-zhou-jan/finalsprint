"use client"
import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, FileText, Map, Zap, PenLine, Calendar, RotateCw, BookOpen } from "lucide-react"
import type { SubjectConfig, KnowledgePoint, CrashCourseBlock, PracticeQuestion, DailySprintTask, ErrorRecord } from "@/data/subjects/subject-types"

const MODULES: { key: string; label: string; icon: ReactNode }[] = [
  { key: "", label: "考试任务", icon: <Target className="w-4 h-4" /> },
  { key: "materials", label: "资料中心", icon: <FileText className="w-4 h-4" /> },
  { key: "scope", label: "考纲地图", icon: <Map className="w-4 h-4" /> },
  { key: "crash", label: "速通讲义", icon: <Zap className="w-4 h-4" /> },
  { key: "practice", label: "刷题战场", icon: <PenLine className="w-4 h-4" /> },
  { key: "sprint", label: "冲刺计划", icon: <Calendar className="w-4 h-4" /> },
  { key: "review", label: "回炉中心", icon: <RotateCw className="w-4 h-4" /> },
]

interface SubjectShellProps {
  config: SubjectConfig
  children: ReactNode
}

export function SubjectShell({ config, children }: SubjectShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-2">
          <Link href="/subjects" className="text-zinc-400 hover:text-zinc-600 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{config.icon}</span>
            <div>
              <h1 className="font-bold text-sm truncate">{config.subjectName}</h1>
              <p className="text-[10px] text-zinc-400 truncate">{config.examTypes.join(" / ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none shrink-0">
            {MODULES.map(mod => {
              const href = mod.key ? `/subjects/${config.subjectId}/${mod.key}` : `/subjects/${config.subjectId}`
              const isActive = pathname === href
              return (
                <Link key={mod.key} href={href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 gap-1 text-xs px-2 ${isActive ? "" : "text-zinc-500"}`}
                  >
                    {mod.icon}
                    <span className="hidden md:inline">{mod.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}

/** 考试任务面板 */
export function MissionPanel({ config }: { config: SubjectConfig }) {
  const totalPoints = config.knowledgePoints.length
  const mastered = config.knowledgePoints.filter(p => p.masteryLevel >= 3).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{config.icon}</span>
        <div>
          <h2 className="text-2xl font-bold">{config.subjectName}</h2>
          <p className="text-zinc-500 text-sm">{config.examTypes.join("、")}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-zinc-500">考点总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{config.knowledgeDomains.length}</p>
            <p className="text-xs text-zinc-500">知识板块</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <PenLine className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">{config.practiceQuestions.length}</p>
            <p className="text-xs text-zinc-500">练习题</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-zinc-500">整体进度</span>
        <Progress value={totalPoints ? (mastered / totalPoints) * 100 : 0} className="h-2 flex-1" />
        <span className="font-medium text-orange-600">{mastered}/{totalPoints}</span>
      </div>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">💡 速通策略</h3>
          <p className="text-sm text-zinc-600 mb-4">
            {config.knowledgeDomains.length} 大板块 · {totalPoints} 个考点
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/subjects/${config.subjectId}/crash`}>
              <Button size="sm" className="gap-1"><Zap className="w-4 h-4" />速通讲义</Button>
            </Link>
            <Link href={`/subjects/${config.subjectId}/practice`}>
              <Button size="sm" variant="outline" className="gap-1"><PenLine className="w-4 h-4" />刷题</Button>
            </Link>
            <Link href={`/subjects/${config.subjectId}/sprint`}>
              <Button size="sm" variant="outline" className="gap-1"><Calendar className="w-4 h-4" />冲刺计划</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODULES.filter(m => m.key).map(mod => (
          <Link key={mod.key} href={`/subjects/${config.subjectId}/${mod.key}`}>
            <Card className="hover:border-orange-300 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">{mod.icon}</div>
                <div>
                  <p className="font-medium text-sm">{mod.label}</p>
                  <p className="text-xs text-zinc-400">进入 {mod.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

/** 速通讲义面板 */
export function CrashCoursePanel({ blocks }: { blocks: CrashCourseBlock[] }) {
  const chapters = [...new Set(blocks.map(b => b.chapter))]
  const [activeChapter, setActiveChapter] = useState(chapters[0] || "")
  const filtered = blocks.filter(b => b.chapter === activeChapter)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" />速通讲义</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chapters.map(ch => (
          <Button key={ch} variant={activeChapter === ch ? "default" : "outline"} size="sm" onClick={() => setActiveChapter(ch)}>{ch}</Button>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card><CardContent className="p-8 text-center text-zinc-400">暂无讲义内容</CardContent></Card>
      )}
      <div className="space-y-4">
        {filtered.map(block => (
          <Card key={block.id} className="border-l-4 border-l-orange-400">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-2">{block.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-orange-600 font-medium mb-1">一句话理解</p>
                  <p className="text-sm mb-3">{block.oneLineUnderstanding}</p>
                  <p className="text-xs text-blue-600 font-medium mb-1">考试考法</p>
                  <p className="text-sm">{block.examApproach}</p>
                </div>
                <div>
                  <p className="text-xs text-red-600 font-medium mb-1">必背</p>
                  <ul className="text-sm list-disc list-inside mb-3">{block.mustMemorize.map((m, i) => <li key={i}>{m}</li>)}</ul>
                  <p className="text-xs text-amber-600 font-medium mb-1">易错陷阱</p>
                  <ul className="text-sm list-disc list-inside">{block.traps.map((t, i) => <li key={i}>{t}</li>)}</ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-zinc-50 rounded-xl">
                <p className="text-xs font-medium mb-1">例题</p>
                <p className="text-sm mb-2">{block.example.question}</p>
                <details className="text-sm text-zinc-600">
                  <summary className="cursor-pointer text-orange-600 font-medium">查看解答</summary>
                  <p className="mt-2">{block.example.solution}</p>
                  <p className="mt-1 font-medium">答案：{block.example.answer}</p>
                </details>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** 考纲地图面板 */
export function ScopeMapPanel({ points }: { points: KnowledgePoint[] }) {
  const chapters = [...new Set(points.map(p => p.chapter))]
  const [activeChapter, setActiveChapter] = useState(chapters[0] || "")
  const filtered = points.filter(p => p.chapter === activeChapter)
  const mastered = filtered.filter(p => p.masteryLevel >= 3).length

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><Map className="w-5 h-5 text-blue-500" />考纲地图</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chapters.map(ch => (
          <Button key={ch} variant={activeChapter === ch ? "default" : "outline"} size="sm" onClick={() => setActiveChapter(ch)}>{ch}</Button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
        <span>掌握 {mastered}/{filtered.length}</span>
        <Progress value={filtered.length ? (mastered / filtered.length) * 100 : 0} className="h-1.5 w-24" />
      </div>
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-zinc-400">暂无考点数据</CardContent></Card>
        )}
        {filtered.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${p.importance >= 4 ? "bg-red-500" : p.importance >= 3 ? "bg-orange-500" : "bg-zinc-300"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-zinc-500 truncate">{p.summary}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`w-2 h-2 rounded-full ${level <= p.masteryLevel ? "bg-emerald-400" : "bg-zinc-200"}`} />
                ))}
              </div>
              <Badge variant={p.importance >= 4 ? "destructive" : "secondary"} className="text-[10px] shrink-0">
                P{p.importance}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** 刷题面板 */
export function PracticeArena({ questions }: { questions: PracticeQuestion[] }) {
  const chapters = [...new Set(questions.map(q => q.chapter))]
  const [activeChapter, setActiveChapter] = useState(chapters[0] || "")
  const [idx, setIdx] = useState(0)
  const filtered = questions.filter(q => q.chapter === activeChapter)
  const q = filtered[idx]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><PenLine className="w-5 h-5 text-orange-500" />刷题战场</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chapters.map(ch => (
          <Button key={ch} variant={activeChapter === ch ? "default" : "outline"} size="sm" onClick={() => { setActiveChapter(ch); setIdx(0) }}>{ch}</Button>
        ))}
      </div>
      {!q ? (
        <Card><CardContent className="p-8 text-center text-zinc-400">暂无题目</CardContent></Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{filtered.length} 题</Badge>
                  <Badge variant="secondary">{q.difficulty}</Badge>
                </div>
                <span className="text-xs text-zinc-400">第 {idx + 1} 题</span>
              </div>
              <p className="font-medium mb-4">{q.stem}</p>
              {q.type === "choice" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <button key={i} className="w-full text-left px-4 py-3 rounded-xl border-2 border-zinc-100 hover:border-orange-300 text-sm transition-all">
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  ))}
                </div>
              )}
              {(q.type === "fill" || q.type === "calc" || q.type === "proof") && (
                <div className="p-4 bg-zinc-50 rounded-xl text-sm text-zinc-400 border border-dashed border-zinc-300">
                  在此输入答案…
                </div>
              )}
              <details className="mt-4">
                <summary className="text-sm text-orange-600 cursor-pointer font-medium">查看解析</summary>
                <p className="text-sm text-zinc-600 mt-2">{q.explanation}</p>
              </details>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>上一题</Button>
            <Button className="flex-1" disabled={idx >= filtered.length - 1} onClick={() => setIdx(i => i + 1)}>下一题</Button>
          </div>
        </>
      )}
    </div>
  )
}

/** 冲刺计划面板 */
export function SprintPlanPanel({ days }: { days: DailySprintTask[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-500" />冲刺计划</h2>
      {days.length === 0 && (
        <Card><CardContent className="p-8 text-center text-zinc-400">暂无计划</CardContent></Card>
      )}
      <div className="grid grid-cols-1 gap-3">
        {days.map(day => (
          <Card key={day.id} className={day.status === "done" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">第 {day.dayIndex} 天 · {day.title}</h3>
                <Badge variant={day.status === "done" ? "secondary" : "outline"}>{day.status === "done" ? "✅ 已完成" : "待完成"}</Badge>
              </div>
              <div className="space-y-2">
                {day.tasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.type === "learn" ? "bg-blue-400" : t.type === "practice" ? "bg-orange-400" : "bg-green-400"}`} />
                    <span className="flex-1">{t.content}</span>
                    <span className="text-xs text-zinc-400">{t.estimatedMinutes}min</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** 资料中心面板 */
export function MaterialsPanel({ domains }: { domains: readonly string[] }) {
  const materialTypes = [
    { type: "bilibili", label: "B站速通课", icon: "▶", desc: "搜索 B站播放量最高的期末速通视频" },
    { type: "pdf", label: "教材PDF", icon: "📄", desc: "教材课后题 + 章节总结" },
    { type: "exam_paper", label: "历年真题", icon: "📝", desc: "近3年期末考试真题汇编" },
    { type: "ppt", label: "课程PPT", icon: "📊", desc: "老师的复习课PPT重点提炼" },
    { type: "text_scope", label: "考试范围文档", icon: "📋", desc: "考试范围及题型分布说明" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-500" />资料中心
      </h2>
      <p className="text-sm text-zinc-500">
        已识别 {domains.length} 个知识板块 · 可关联 {materialTypes.length} 类资料源
      </p>
      <div className="flex flex-wrap gap-2">
        {domains.map((d, i) => (
          <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {materialTypes.map((mt, i) => (
          <Card key={i} className="hover:border-green-300 transition-colors">
            <CardContent className="p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">{mt.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{mt.label}</h3>
                <p className="text-xs text-zinc-400 mt-1">{mt.desc}</p>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 mt-3" disabled>
                  <BookOpen className="w-3 h-3" />待上传
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-2">🤖 AI 资料处理</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            <span className="px-2 py-1 bg-white rounded">上传资料</span><span>→</span>
            <span className="px-2 py-1 bg-white rounded">OCR/文本提取</span><span>→</span>
            <span className="px-2 py-1 bg-white rounded">AI 提取考点</span><span>→</span>
            <span className="px-2 py-1 bg-white rounded">生成讲义+题目</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/** 回炉中心面板 */
export function ReviewCenterPanel({ errors }: { errors: ErrorRecord[] }) {
  const errorLabels: Record<string, string> = {
    concept: "概念不清", formula: "公式遗忘", careless: "粗心失误", no_idea: "完全不会",
  }
  const errorTypes = ["concept", "formula", "careless", "no_idea"] as const

  if (errors.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-purple-500" />回炉中心
        </h2>
        <Card><CardContent className="p-12 text-center">
          <RotateCw className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
          <p className="text-zinc-500 font-medium">暂无错题记录</p>
          <p className="text-sm text-zinc-400 mt-1">去刷题场练习，错题会自动收集到这里</p>
        </CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <RotateCw className="w-5 h-5 text-purple-500" />回炉中心
      </h2>
      <div className="flex gap-2 flex-wrap">
        {errorTypes.map(et => {
          const count = errors.filter(e => e.errorReason === et).length
          return count > 0 ? <Badge key={et} variant="outline" className="text-xs">{errorLabels[et]}: {count}题</Badge> : null
        })}
      </div>
      <div className="space-y-3">
        {errors.map(err => (
          <Card key={err.id} className="border-l-4 border-l-red-400">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Badge variant="destructive" className="text-[10px] shrink-0 mt-0.5">{errorLabels[err.errorReason]}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{err.questionStem}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-red-500 font-medium">你的答案：</span><span className="text-zinc-500">{err.userAnswer}</span></div>
                    <div><span className="text-green-600 font-medium">正确答案：</span><span className="text-zinc-600">{err.correctAnswer}</span></div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">{err.relatedChapter} · {err.relatedPoint}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-5 text-center">
          <p className="text-sm text-zinc-600">💡 消灭 {errors.length} 道错题至少提升 10 分 — 回炉重做是提分最快的方式</p>
        </CardContent>
      </Card>
    </div>
  )
}