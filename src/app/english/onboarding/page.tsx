"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Link2, Zap, Sparkles, SkipForward, Loader2, Globe } from "lucide-react"

export default function EnglishOnboardingPage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"" | "success" | "error">("")
  const [msg, setMsg] = useState("")

  const handleImport = async () => {
    const trimmed = url.trim()
    if (!trimmed) return
    setLoading(true)
    setStatus("")
    try {
      const resp = await fetch("/api/english/import-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, module: "reading" }),
      })
      const data = await resp.json()
      if (resp.ok) {
        setStatus("success")
        setMsg("解析成功！AI 已提取内容，即将进入诊断...")
        if (data.content) localStorage.setItem("english_video_content", JSON.stringify(data.content))
        setTimeout(() => router.push("/english/quiz"), 1500)
      } else {
        setStatus("error")
        setMsg(data.error || "解析失败，请检查链接")
      }
    } catch {
      setStatus("error")
      setMsg("网络错误，请稍后重试")
    }
    setLoading(false)
  }

  const handleSkip = () => {
    localStorage.removeItem("english_video_content")
    router.push("/english/quiz")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 via-white to-pink-50/30">
      <div className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <button onClick={() => router.push("/subjects")} className="text-red-200 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />学科总站
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">大学英语四六级</h1>
              <p className="text-red-100 text-sm mt-0.5">CET-4 / CET-6 · AI 诊断 · 视频导入</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-center gap-3 text-sm">
          {[
            { label: "导入资料", active: true },
            { label: "诊断测验", active: false },
            { label: "英语训练", active: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.active ? "bg-red-500 text-white" : "bg-zinc-200 text-zinc-500"}`}>{i + 1}</div>
              <span className={s.active ? "font-medium text-zinc-800" : "text-zinc-400"}>{s.label}</span>
              {i < 2 && <span className="text-zinc-300">→</span>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <Link2 className="w-4 h-4 text-red-500" />粘贴视频/文章链接
          </div>
          <p className="text-xs text-zinc-400">
            支持 B站、YouTube、英语学习网站等。AI 自动解析内容并全网搜索相关真题，构建专属题库。
          </p>
          <input type="url" value={url} onChange={e => { setUrl(e.target.value); setStatus("") }}
            placeholder="https://www.bilibili.com/video/..."
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all" disabled={loading} />

          {status === "success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />{msg}
            </div>
          )}
          {status === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{msg}</div>
          )}

          <button onClick={handleImport} disabled={loading || !url.trim()}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "AI 解析中…" : "开始导入并诊断"}
          </button>
        </div>

        <div className="text-center">
          <button onClick={handleSkip} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
            <SkipForward className="w-4 h-4" />跳过，直接开始诊断
          </button>
          <p className="text-xs text-zinc-300 mt-2">不上传也可以，AI 将基于全网题库生成诊断题目</p>
        </div>
      </div>
    </div>
  )
}
