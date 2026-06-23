"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, CheckCircle2, BookOpen } from "lucide-react";
import { getChapterList } from "@/data/subjects/math";

const CATEGORIES: Record<string, { icon: string; mode: string; approach: string }> = {
  "高等数学": { icon: "📐", mode: "计算型·题型闯关", approach: "速通方法：先背必考公式 → 看懂经典例题 → 做同类练习 → 变式训练 → 速刷检验" },
  "大学物理": { icon: "⚛️", mode: "理解型·题型分类", approach: "速通方法：记忆核心物理模型 → 套用解题模板 → 专项练习 → 综合测试" },
  "工程力学": { icon: "🔧", mode: "计算型·案例刷题", approach: "速通方法：理解力学原理 → 掌握受力分析 → 套用公式解题 → 大量刷题" },
  "C++程序设计": { icon: "💻", mode: "技能型·语法驱动", approach: "速通方法：先学语法规则 → 看代码示例 → 自己动手写 → AI批改反馈" },
  "Python": { icon: "🐍", mode: "技能型·语法驱动", approach: "速通方法：从基础语法开始 → 函数与模块 → 面向对象 → 实战项目" },
  "互换性测量": { icon: "📏", mode: "记忆型·概念理解", approach: "速通方法：理解公差概念 → 记忆配合制度 → 对比辨析 → 图表记忆" },
};

function getChapters(sub: string) {
  const fromPreset = getChapterList(sub);
  if (fromPreset.length > 0) return fromPreset.map(c => ({ name: c.name, desc: `${c.score} · ${"★".repeat(c.weight)}`, progress: 0 }));
  const FALLBACKS: Record<string, string[]> = {
    "大学物理": ["质点运动学","牛顿定律","动量与能量","刚体转动"],
    "工程力学": ["静力学基础","平面力系","材料力学基础"],
    "C++程序设计": ["基础语法","类和对象","指针与引用","STL容器"],
    "Python": ["基础语法","函数与模块","面向对象","文件操作"],
    "互换性测量": ["公差与配合","形位公差","表面粗糙度","测量技术"],
  };
  for (const [k, v] of Object.entries(FALLBACKS)) if (sub.includes(k)) return v.map(n => ({ name: n, desc: "", progress: 0 }));
  return [{ name: `${sub}基础`, desc: "", progress: 0 }];
}

export default function SubjectHomePage() {
  const { subject } = useParams() as { subject: string };
  const router = useRouter();
  const decoded = decodeURIComponent(subject);
  const cat = CATEGORIES[decoded] || { icon: "📚", mode: "速通学习", approach: "逐章学习，从概念到练习，速刷检验" };
  const chapters = getChapters(decoded);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{cat.icon}</span>
          <div><h1 className="text-2xl font-bold">{decoded}</h1><p className="text-sm text-zinc-500">{cat.mode}</p></div>
        </div>
        <p className="text-sm text-zinc-600 bg-zinc-50 rounded-xl p-4">{cat.approach}</p>
      </div>
      <h2 className="font-bold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-orange-500" />学习章节</h2>
      <div className="space-y-2">
        {chapters.map((ch) => (
          <button key={ch.name} onClick={() => router.push(`/subjects/${encodeURIComponent(decoded)}/${encodeURIComponent(ch.name)}`)}
            className="w-full text-left p-4 flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white hover:shadow-md hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              {ch.progress >= 80 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <span className="text-sm font-bold text-zinc-400">○</span>}
            </div>
            <div className="flex-1"><p className="font-semibold text-sm">{ch.name}</p>{ch.desc && <p className="text-xs text-zinc-400">{ch.desc}</p>}</div>
            <ChevronRight className="w-5 h-5 text-zinc-300" />
          </button>
        ))}
      </div>
    </div>
  );
}