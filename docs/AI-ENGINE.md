# FinalSprint AI 提分引擎设计

> 版本: v1.0 | 日期: 2026-06-22

## 0. 设计原则

AI 不是聊天机器人。是一组**输入结构化→输出JSON→Zod校验**的纯函数式 prompt pipeline。
每个 prompt 站在"期末冲刺教练"视角，不做泛知识讲解，只做考试提分决策。

## 1. 七大模块

| 模块 | 输入 | 输出 | 状态 |
|------|------|------|------|
| M1 资料解析 | PDF文本+科目 | MaterialExtraction | 设计 |
| M2 诊断题生成 | ExamPoint[]+目标分 | DiagnosticPaper | 设计 |
| M3 诊断分析 | 答案+ExamPoint[] | WeakOpportunity[]+RiskReport | ✅规则 |
| M4 提分计划 | 诊断+参数 | SprintPlanOutput | ✅规则 |
| M5 冲刺卡 | ExamPoint+科目 | SprintCard | 设计 |
| M6 错题归因 | 题目+答案+用户答 | ErrorAnalysis | 设计 |
| M7 考前冲刺 | Mock成绩+天数 | FinalSprint | 设计 |

## 2. M1: 资料解析器

**Prompt 指令**: "你是期末冲刺教练。只提取与考试直接相关的内容：考试会考的、老师强调的、往年出现过的。不要写学习建议。"

**输出 Schema**:
```typescript
{
  materialSummary: string
  chapters: { title, keyConcepts[], formulas[], teacherEmphasis?[] }[]
  possibleExamPoints: {
    title, chapterTitle?, evidence[]
    estimatedScoreMin, estimatedScoreMax, hitRate, avgStudyMinutes
    targetTier: "pass"|"75"|"85", importanceTier: "must"|"important"|"optional"
    formulas: {name, latex, condition, mnemonic?}[]
    commonPatterns[], solvingTemplate[], traps[]
  }[]
}
```

**学科差异**: 高数→公式+计算+证明；物理→公式+模型+单位；C++→代码+语法；英语→单词+作文模板

## 3. M2: 诊断题生成器

**覆盖策略**: must考点≥2题, important≥1题。总题数min(考点×1.5,20)。

**难度分布**: 基础40%+中等40%+困难20%。题型: single 60%+fill 25%+calculation 15%。

**输出 Schema**:
```typescript
{
  questions: { type, difficulty, stem, options?, answer, explanation, examPointTitle }[]
}
```

## 4. M5: 考点冲刺卡

**五段式输出**:
```typescript
{
  examPointTitle: string
  howItIsTested: { commonTypes[], typicalScore, typicalWording[] }
  quickLearn: { minimalConcept, mustMemorize: {name,latex,condition}[], recognitionSignals[] }
  solvingTemplate: string[]
  commonTraps: { trap, why, howToAvoid }[]
  example: { question, solution, steps[] }
}
```

## 5. M6: 错题归因器

**错误分类**: concept(概念不清) | formula(公式记错) | calculation(计算错) | careless(审题) | no_idea(完全不会)

**输出 Schema**:
```typescript
{ errorType, reason, reviewPoint, suggestedAction, similarQuestion? }
```

## 6. M7: 考前冲刺分析器

**输出 Schema**:
```typescript
{
  predictedScore: {min, max}
  lastMinuteMustDo: string[]
  top3ReviewPoints: {title, action, expectedGain}[]
  examStrategy: { timeAllocation, answerOrder, emergencyTips[] }
  finalCheatSheet: string[]
}
```

## 7. Prompt 文件组织

```
src/features/ai/prompts/
├── material-extraction.ts    # M1
├── diagnostic-generator.ts   # M2
├── sprint-card.ts            # M5
├── error-attribution.ts      # M6
├── exam-analyzer.ts          # M7
└── shared/
    ├── system-prompts.ts     # 通用角色提示
    ├── subject-rules.ts      # 学科差异规则
    └── output-schemas.ts     # 共享 Zod schema
```

每个文件导出: `SYSTEM_PROMPT` + `buildUserPrompt(input)` + `OutputSchema`
