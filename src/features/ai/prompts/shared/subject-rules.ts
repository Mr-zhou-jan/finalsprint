// 学科差异化规则

export type SubjectType = "advanced_math" | "physics" | "cpp" | "english" | "politics" | "generic"

export function detectSubject(name: string): SubjectType {
  const l = name.toLowerCase()
  if (l.includes("高数")||l.includes("微积分")||l.includes("数学")) return "advanced_math"
  if (l.includes("物理")) return "physics"
  if (l.includes("c++")||l.includes("cpp")) return "cpp"
  if (l.includes("英语")||l.includes("english")) return "english"
  if (l.includes("思政")||l.includes("马原")||l.includes("毛概")) return "politics"
  return "generic"
}

export const SUBJECT_RULES: Record<SubjectType, { focus: string; formula: string; qTypes: string }> = {
  advanced_math: { focus: "公式+计算题型+证明套路。LaTeX输出。重点：极限/导数/积分/微分方程。", formula: "LaTeX：\\lim_{x\\to 0}\\frac{\\sin x}{x}=1。附条件。", qTypes: "选择40%+填空20%+计算30%+证明10%" },
  physics: { focus: "物理模型+公式+单位。重点：牛顿定律/守恒律/电磁场。", formula: "LaTeX+条件。如 F=ma(惯性系)。附单位换算。", qTypes: "选择30%+填空20%+计算50%" },
  cpp: { focus: "语法+代码片段+常见错误。重点：指针/类/STL/继承。", formula: "代码块格式。附注释。", qTypes: "选择40%+读程30%+编程30%" },
  english: { focus: "高频词汇+语法+阅读技巧+作文模板。", formula: "文本。单词配释义+例句。", qTypes: "选择40%+阅读30%+翻译15%+写作15%" },
  politics: { focus: "核心概念+时间线+辨析模板。", formula: "文本。概念配关键词。", qTypes: "选择40%+简答30%+辨析30%" },
  generic: { focus: "考试相关概念+公式+题型。", formula: "按需。", qTypes: "选择50%+填空25%+简答25%" },
}
