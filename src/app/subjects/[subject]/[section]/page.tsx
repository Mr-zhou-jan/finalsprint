"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, XCircle, Zap, ArrowLeft } from "lucide-react";
import { getChapterContent } from "@/data/subjects";

type AnswerState = Record<string, { value: string; revealed: boolean; correct: boolean | null }>;

export default function SectionPage() {
  const { subject, section } = useParams() as { subject: string; section: string };
  const router = useRouter();
  const ds = decodeURIComponent(subject);
  const dsec = decodeURIComponent(section);
  const content = getChapterContent(dsec);

  const [speedMode, setSpeedMode] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [speedAns, setSpeedAns] = useState<number | null>(null);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedRevealed, setSpeedRevealed] = useState(false);
  const [speedDone, setSpeedDone] = useState(false);
  const [practiceAns, setPracticeAns] = useState<AnswerState>({});
  const [formulaOpen, setFormulaOpen] = useState(true);
  const [localProgress, setLocalProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const key = `fs_subject_progress`;
    try { const saved = JSON.parse(localStorage.getItem(key) || "{}"); setLocalProgress(saved[ds] || {}); } catch {}
  }, [ds]);

  const markDone = (typeIdx: number) => {
    const key = `fs_subject_progress`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      const chapter = saved[ds] || {};
      chapter[`t${typeIdx}`] = true;
      saved[ds] = chapter;
      localStorage.setItem(key, JSON.stringify(saved));
      setLocalProgress(chapter);
    } catch {}
  };

  if (!content) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{dsec}</h2>
        <p className="text-zinc-500 mb-4">该章节暂未配置预设内容。</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-zinc-100 rounded-xl text-sm font-medium">返回</button>
      </div>
    );
  }

  if (speedMode && !speedDone) {
    const q = content.speedRun[speedIdx];
    if (!q) return null;
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-zinc-400">⚡ 速刷 {speedIdx + 1}/{content.speedRun.length}</span>
          <span className="text-sm font-bold text-orange-600">✅ {speedScore}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(speedIdx / content.speedRun.length) * 100}%` }} />
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-4">
          <p className="font-bold text-lg mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSel = speedAns === i;
              let cls = "border-zinc-100 hover:border-zinc-300";
              if (speedRevealed) {
                if (i === q.correctIndex) cls = "border-emerald-400 bg-emerald-50";
                else if (isSel) cls = "border-red-400 bg-red-50";
                else cls = "border-zinc-100 opacity-40";
              } else if (isSel) cls = "border-orange-400 bg-orange-50";
              return (
                <button key={i} onClick={() => { if (!speedRevealed) setSpeedAns(i); }} disabled={speedRevealed}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}>
                  {String.fromCharCode(65 + i)}. {opt}
                  {speedRevealed && i === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-2" />}
                </button>
              );
            })}
          </div>
          {speedRevealed && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${speedAns === q.correctIndex ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              <p className="font-bold mb-1">{speedAns === q.correctIndex ? "✅ 正确！" : "❌ 错误"}</p>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>
        {!speedRevealed ? (
          <button onClick={() => { setSpeedRevealed(true); if (speedAns === q.correctIndex) setSpeedScore(s => s + 1); }}
            disabled={speedAns === null} className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg disabled:opacity-40">确认答案</button>
        ) : (
          <button onClick={() => {
            if (speedIdx + 1 >= content.speedRun.length) setSpeedDone(true);
            else { setSpeedIdx(i => i + 1); setSpeedAns(null); setSpeedRevealed(false); }
          }} className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg">
            {speedIdx + 1 >= content.speedRun.length ? "查看结果 →" : "下一题 →"}
          </button>
        )}
        <button onClick={() => setSpeedMode(false)} className="w-full mt-2 py-2 text-sm text-zinc-400 hover:text-zinc-600">退出速刷</button>
      </div>
    );
  }

  if (speedMode && speedDone) {
    const pct = Math.round((speedScore / content.speedRun.length) * 100);
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center mb-4">
          <span className="text-4xl">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">速刷完成！</h2>
        <p className="text-lg mb-1">{speedScore}/{content.speedRun.length} 正确</p>
        <p className={`text-3xl font-bold mb-6 ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>{pct}分</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSpeedIdx(0); setSpeedAns(null); setSpeedRevealed(false); setSpeedScore(0); setSpeedDone(false); }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg">再来一次</button>
          <button onClick={() => setSpeedMode(false)} className="px-6 py-3 rounded-2xl border border-zinc-200 text-zinc-600 font-bold">返回章节</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="w-4 h-4" />返回
      </button>
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📐</span>
              <h1 className="text-2xl font-bold">{dsec}</h1>
            </div>
            <p className="text-sm text-zinc-500">
              考试占比 {"★".repeat(content.examWeight)}{"☆".repeat(5 - content.examWeight)} · {content.examScore}
            </p>
          </div>
          <button onClick={() => { setSpeedIdx(0); setSpeedAns(null); setSpeedRevealed(false); setSpeedScore(0); setSpeedDone(false); setSpeedMode(true); }}
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all">
            <Zap className="w-4 h-4" /> 速刷
          </button>
        </div>
      </div>
      <div>
        <button onClick={() => setFormulaOpen(!formulaOpen)}
          className="flex items-center gap-2 mb-3 w-full text-left group">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold text-lg">必考公式 ({content.formulas.length})</h2>
          {formulaOpen ? <ChevronUp className="w-4 h-4 text-zinc-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto" />}
        </button>
        {formulaOpen && (
          <div className="grid gap-2">
            {content.formulas.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-4">
                <p className="font-bold text-sm text-orange-700 mb-1">{f.name}</p>
                <p className="text-sm font-mono text-zinc-700 mb-1">{f.latex}</p>
                <p className="text-xs text-zinc-400">{f.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> 经典题型 ({content.problemTypes.length})
        </h2>
        <div className="space-y-5">
          {content.problemTypes.map((pt, ptIdx) => {
            const pk = `pt${ptIdx}`;
            const pa = practiceAns[pk] || { value: "", revealed: false, correct: null };
            const isDone = localProgress[`t${ptIdx}`];
            return (
              <div key={ptIdx} className="bg-white rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{pt.examFrequency}</span>
                  <h3 className="font-bold">{pt.name}</h3>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                </div>
                <div className="bg-blue-50/50 rounded-xl p-4 mb-3">
                  <p className="text-xs font-bold text-blue-600 mb-1">📝 例题</p>
                  <p className="text-sm font-semibold text-blue-900 mb-2">{pt.example.question}</p>
                  <details className="group">
                    <summary className="text-sm font-bold text-blue-700 cursor-pointer hover:text-blue-800 select-none">查看解答 ▾</summary>
                    <div className="mt-2 space-y-1">
                      {pt.example.steps.map((s, si) => (
                        <p key={si} className="text-sm text-blue-800">{(si + 1)}. {s}</p>
                      ))}
                      <p className="text-sm font-bold text-blue-900 mt-2">答案：{pt.example.answer}</p>
                    </div>
                  </details>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-zinc-600 mb-1">✍️ 练一道</p>
                  <p className="text-sm font-semibold mb-3">{pt.practice.question}</p>
                  <div className="flex gap-2">
                    <input type="text" value={pa.value}
                      onChange={e => setPracticeAns(p => ({ ...p, [pk]: { ...pa, value: e.target.value } }))}
                      onKeyDown={e => {
                        if (e.key !== "Enter" || pa.revealed) return;
                        const correct = e.currentTarget.value.trim().toLowerCase() === pt.practice.answer.toLowerCase();
                        setPracticeAns(p => ({ ...p, [pk]: { ...pa, revealed: true, correct } }));
                        if (correct) markDone(ptIdx);
                      }}
                      disabled={pa.revealed}
                      placeholder="输入你的答案…"
                      className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-orange-400 disabled:opacity-50"
                      autoComplete="off" />
                    <button onClick={() => {
                        const correct = pa.value.trim().toLowerCase() === pt.practice.answer.toLowerCase();
                        setPracticeAns(p => ({ ...p, [pk]: { ...pa, revealed: true, correct } }));
                        if (correct) markDone(ptIdx);
                      }}
                      disabled={pa.revealed || !pa.value.trim()}
                      className="px-4 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-30 hover:bg-orange-600 transition-colors">提交</button>
                  </div>
                  {pa.revealed && (
                    <div className={`mt-3 p-3 rounded-xl text-sm ${pa.correct ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                      <p className="font-bold mb-1">{pa.correct ? "✅ 正确！" : "❌ 不对"}</p>
                      <p>答案：{pt.practice.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" /> 常见陷阱
        </h2>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-2">
          {content.traps.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl text-sm text-red-800">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center pt-4">
        <button onClick={() => { setSpeedIdx(0); setSpeedAns(null); setSpeedRevealed(false); setSpeedScore(0); setSpeedDone(false); setSpeedMode(true); }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
          ⚡ 开始速刷（{content.speedRun.length}题）
        </button>
      </div>
    </div>
  );
}