"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, CheckCircle2, Zap, ChevronRight, Sparkles } from "lucide-react"

const SUBJECT_CHAPTERS: Record<string, { name: string; desc: string }[]> = {
  "高等数学": [
    { name: "函数与极限", desc: "两个重要极限·等价无穷小·洛必达" },
    { name: "导数与微分", desc: "求导法则·隐函数·高阶导数" },
    { name: "中值定理与导数应用", desc: "罗尔·拉格朗日·泰勒·单调性" },
    { name: "不定积分", desc: "换元法·分部积分·有理函数" },
    { name: "定积分", desc: "牛顿-莱布尼茨·反常积分·应用" },
    { name: "微分方程", desc: "可分离·齐次·一阶线性·二阶常系数" },
  ],
  "大学物理": [
    { name: "质点运动学", desc: "位置·速度·加速度·圆周运动" },
    { name: "牛顿定律", desc: "牛二·惯性系·受力分析" },
    { name: "动量与能量", desc: "动量守恒·动能定理·势能" },
    { name: "刚体转动", desc: "转动惯量·角动量·力矩" },
  ],
  "工程力学": [
    { name: "静力学基础", desc: "力的平衡·约束·受力图" },
    { name: "平面力系", desc: "汇交力系·力偶·简化" },
    { name: "材料力学基础", desc: "拉压·剪切·弯曲·扭转" },
  ],
  "C++程序设计": [
    { name: "基础语法", desc: "变量·表达式·流程控制" },
    { name: "类和对象", desc: "封装·构造析构·this指针" },
    { name: "指针与引用", desc: "指针·引用·动态内存" },
    { name: "STL容器", desc: "vector·map·string·算法" },
    { name: "继承与多态", desc: "继承·虚函数·抽象类" },
  ],
  "Python": [
    { name: "基础语法", desc: "变量·列表·字典·控制流" },
    { name: "函数与模块", desc: "函数定义·lambda·模块导入" },
    { name: "面向对象", desc: "类·继承·特殊方法" },
    { name: "文件操作", desc: "读写文件·异常处理·with" },
    { name: "常用库", desc: "numpy·pandas·matplotlib" },
  ],
  "互换性测量": [
    { name: "公差与配合", desc: "尺寸公差·配合制·精度等级" },
    { name: "形位公差", desc: "形状·方向·位置公差" },
    { name: "表面粗糙度", desc: "Ra·Rz·加工符号" },
    { name: "测量技术", desc: "量具·千分尺·三坐标" },
  ],
}

export default function SubjectsListPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    try { setProgress(JSON.parse(localStorage.getItem("fs_subject_progress") || "{}")) } catch { }
  }, [])

  const subjects = Object.entries(SUBJECT_CHAPTERS)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-orange-500" />
        <div><h1 className="text-2xl font-bold">学科速通</h1><p className="text-sm text-zinc-500">选择学科，速学公式、做例题、速刷题</p></div>
      </div>

      <div className="grid gap-4">
        {subjects.map(([name, chapters]) => {
          const doneCount = chapters.filter(ch => (progress[`${name}:${ch.name}`] || 0) >= 80).length
          const totalCount = chapters.length
          return (
            <button key={name} onClick={() => router.push(`/subjects/${encodeURIComponent(name)}`)}
              className="w-full text-left card-hover p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg">{name}</h2>
                  <p className="text-sm text-zinc-500">{totalCount} 个章节 · 进度 {doneCount}/{totalCount}</p>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }} />
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <p className="font-bold text-orange-800">每科公式→例题→练习→速刷，一页速通</p>
        </div>
        <p className="text-sm text-zinc-500">临近考试推荐创建冲刺项目，针对性提分。</p>
      </div>
    </div>
  )
}