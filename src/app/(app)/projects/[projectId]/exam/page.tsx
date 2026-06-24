"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, Target, AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"

type Phase = "start" | "taking" | "report"

export default function MockExamPage() {
  const { projectId } = useParams() as { projectId: string }
  const [phase, setPhase] = useState<Phase>("start")
  const [questions, setQuestions] = useState<any[]>([])
  const [sessionId, setSessionId] = useState("")
  const [totalScore, setTotalScore] = useState(100)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)

  useEffect(() => { if (timerRunning && timeLeft > 0) { const t = setInterval(() => setTimeLeft(s => s - 1), 1000); return () => clearInterval(t) } if (timeLeft === 0 && timerRunning) handleSubmit() }, [timeLeft, timerRunning])

  const handleStart = async () => { setLoading(true); const res = await fetch(`/api/projects/${projectId}/exam/generate`, { method: "POST" }); const data = await res.json(); setQuestions(data.questions||[]); setSessionId(data.sessionId); setTotalScore(data.totalScore||100); setDurationMinutes(data.durationMinutes||60); setAnswers({}); setCurrentIdx(0); setTimeLeft((data.durationMinutes||60)*60); setPhase("taking"); setTimerRunning(true); setLoading(false) }

  const handleSubmit = async () => { setTimerRunning(false); setLoading(true); const ans: Record<string,string>={}; questions.forEach((q,i)=>{if(answers[String(i)])ans[q.id]=answers[String(i)]}); const res=await fetch(`/api/projects/${projectId}/exam/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId,answers:ans})}); const d=await res.json(); setReport(d); setPhase("report"); setLoading(false) }

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>

  if (phase==="start") return <div className="p-6 max-w-lg mx-auto pt-20"><Card className="text-center"><CardContent className="p-8"><Target className="w-16 h-16 text-orange-500 mx-auto mb-4" /><h1 className="text-2xl font-bold mb-2">模拟考场</h1><p className="text-zinc-500 mb-6">从全部考点抽题组卷。限时作答，自动评分，考前冲刺建议。</p><div className="text-left bg-zinc-50 rounded-xl p-4 mb-6 space-y-2 text-sm"><p><Clock className="w-4 h-4 inline mr-1" />限时作答，倒计时结束自动交卷</p><p><AlertTriangle className="w-4 h-4 inline mr-1" />交卷前可修改答案</p><p><TrendingUp className="w-4 h-4 inline mr-1" />考后生成估分报告+冲刺建议</p></div><Button size="lg" onClick={handleStart} className="gap-2"><Zap className="w-4 h-4" />开始考试</Button></CardContent></Card></div>

  if (phase==="taking") { const q=questions[currentIdx]; if(!q) return null; const m=Math.floor(timeLeft/60); const s=timeLeft%60;
    return <div className="p-6 max-w-2xl mx-auto"><div className="flex items-center justify-between mb-4"><span className="text-sm font-bold text-zinc-400">模拟考·第{currentIdx+1}/{questions.length}题</span><span className={`text-lg font-bold font-mono ${timeLeft<300?"text-red-500 animate-pulse":"text-zinc-600"}`}>⏱{m}:{String(s).padStart(2,"0")}</span></div>
      <Progress value={((currentIdx+1)/questions.length)*100} className="mb-6 h-2" />
      <Card><CardContent className="p-6"><Badge variant="secondary" className="mb-2">{q.scoreValue||5}分</Badge><p className="font-bold text-lg mb-4">{q.stem}</p>
        {q.type==="single"&&<div className="space-y-2">{(q.options as string[]||[]).map((o:string,i:number)=>{const sel=answers[String(currentIdx)]===String(i);return <button key={i} onClick={()=>setAnswers(a=>({...a,[String(currentIdx)]:String(i)}))} className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${sel?"border-orange-400 bg-orange-50":"border-zinc-100 hover:border-zinc-300"}`}>{String.fromCharCode(65+i)}. {o}</button>})}</div>}
        {(q.type==="fill"||q.type==="calculation")&&<input type="text" value={answers[String(currentIdx)]||""} onChange={e=>setAnswers(a=>({...a,[String(currentIdx)]:e.target.value}))} placeholder="输入答案…" className="w-full px-4 py-3 border rounded-xl text-sm" autoComplete="off" />}
      </CardContent></Card>
      <div className="flex gap-3 mt-4"><Button variant="outline" disabled={currentIdx===0} onClick={()=>setCurrentIdx(i=>i-1)}>上一题</Button>{currentIdx<questions.length-1?<Button className="flex-1" onClick={()=>setCurrentIdx(i=>i+1)}>下一题</Button>:<Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleSubmit}>交卷</Button>}</div></div> }

  if (phase==="report"&&report) { const a=report.sprintAdvice||{}
    return <div className="p-6 max-w-3xl mx-auto space-y-6"><h1 className="text-2xl font-bold">模拟考报告</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card className="bg-orange-50"><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-orange-700">{report.scorePercent}分</p><p className="text-xs">得分率</p></CardContent></Card><Card className="bg-blue-50"><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{report.earnedScore}/{report.totalScore}</p><p className="text-xs">得分/总分</p></CardContent></Card><Card className="bg-emerald-50"><CardContent className="p-4 text-center"><p className="text-3xl font-bold">{report.predictedMin}~{report.predictedMax}</p><p className="text-xs">更新估分</p></CardContent></Card></div>
      {a.top3ReviewPoints&&<Card className="border-orange-300 bg-orange-50/50"><CardContent className="p-4"><h3 className="font-bold text-orange-700 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" />考前冲刺建议</h3><div className="space-y-2">{(a.top3ReviewPoints as any[])?.map((r:any,i:number)=><div key={i} className="p-3 bg-white rounded-xl text-sm"><span className="font-bold">{["🥇","🥈","🥉"][i]}</span> {r.title||r.examPointTitle}：{r.action||r.recommendedAction}，+{r.expectedGain||r.scoreGain}分</div>)}</div>{a.examStrategy&&<div className="mt-4 p-3 bg-white rounded-xl text-sm"><p className="font-bold mb-1">临场策略</p><p className="text-xs text-zinc-500">{a.examStrategy.timeAllocation}</p></div>}</CardContent></Card>}
      <div className="flex gap-3 justify-center"><Link href={`/projects/${projectId}/overview`}><Button variant="outline">返回战情室</Button></Link><Button onClick={()=>{setPhase("start");setReport(null)}}>再考一次</Button></div></div> }

  return null
}
