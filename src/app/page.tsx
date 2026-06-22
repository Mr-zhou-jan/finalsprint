import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Target, TrendingUp, Clock, BookOpen, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-orange-50">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div><span className="font-bold text-xl">FinalSprint</span></div>
        <div className="flex items-center gap-3"><Link href="/login"><Button variant="ghost">登录</Button></Link><Link href="/register"><Button>免费开始</Button></Link></div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6"><Clock className="w-4 h-4" />适合考前 3 天 ~ 3 周冲刺</div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">期末 <span className="text-orange-600">最短时间</span><br />提到目标分</h1>
        <p className="text-xl text-zinc-500 mb-10 max-w-xl mx-auto">上传资料 → AI 提取考点 → 诊断水平 → 生成每日提分计划。<br />不是学习平台，是提分系统。</p>
        <Link href="/register"><Button size="lg" className="text-lg px-8 py-6 gap-2">开始冲刺 <ArrowRight className="w-5 h-5" /></Button></Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          {[{ icon: Target, title: "只练会考的", desc: "AI 分析资料和往年题，只提取考试相关考点" }, { icon: TrendingUp, title: "最短提分路线", desc: "基于目标分和剩余天数，计算每条路线的提分收益" }, { icon: BookOpen, title: "每日作战任务", desc: "每天告诉你学什么、做几道题、花多久" }].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4"><f.icon className="w-5 h-5 text-orange-600" /></div><h3 className="font-bold text-lg mb-2">{f.title}</h3><p className="text-sm text-zinc-500">{f.desc}</p></div>
          ))}
        </div>
      </main>
    </div>
  )
}
