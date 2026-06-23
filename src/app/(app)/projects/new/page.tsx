"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    subjectName: "", examDate: "", targetScore: 60,
    currentLevel: "weak" as "zero" | "weak" | "average",
    dailyMinutes: 60,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok || data.error) { setError(data.error || `HTTP ${res.status}`); setLoading(false); return }
      if (data.id) { router.push(`/projects/${data.id}/overview`); return }
      setError("创建成功但缺少项目ID"); setLoading(false)
    } catch { setError("网络错误"); setLoading(false) }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Link href="/projects" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 mb-6"><ArrowLeft className="w-4 h-4" />返回</Link>
      <Card>
        <CardHeader>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3"><Zap className="w-5 h-5 text-white" /></div>
          <CardTitle>创建考试项目</CardTitle>
          <CardDescription>设定你的期末冲刺目标</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>科目名称</Label><Input value={form.subjectName} onChange={e => setForm(f => ({ ...f, subjectName: e.target.value }))} placeholder="如：高等数学、大学物理" required /></div>
            <div><Label>考试日期</Label><Input type="date" value={form.examDate} onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))} required /></div>
            <div><Label>目标分数</Label>
              <div className="grid grid-cols-3 gap-2">
                {[60, 75, 85].map(s => <Button key={s} type="button" variant={form.targetScore === s ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, targetScore: s }))}>{s} 分{s === 60 ? " 保命" : s === 75 ? " 冲" : " 速冲"}</Button>)}
              </div>
            </div>
            <div><Label>当前基础</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: "zero", l: "零基础" }, { v: "weak", l: "较弱" }, { v: "average", l: "一般" }].map(o => <Button key={o.v} type="button" variant={form.currentLevel === o.v ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, currentLevel: o.v as any }))}>{o.l}</Button>)}
              </div>
            </div>
            <div><Label>每天可用时长（分钟）</Label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 120, 180].map(m => <Button key={m} type="button" variant={form.dailyMinutes === m ? "default" : "outline"} onClick={() => setForm(f => ({ ...f, dailyMinutes: m }))}>{m}min</Button>)}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "创建中…" : "创建项目 →"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
