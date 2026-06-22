// M1: 资料解析 → 考试导向课程结构
import { z } from "zod"
import { COACH_SYSTEM_PROMPT } from "./shared/system-prompts"
import { detectSubject, SUBJECT_RULES } from "./shared/subject-rules"

export const SYSTEM_PROMPT = COACH_SYSTEM_PROMPT

export function buildUserPrompt(rawText: string, subjectName: string): string {
  const r = SUBJECT_RULES[detectSubject(subjectName)] || SUBJECT_RULES.generic
  return `分析以下${subjectName}资料，提取考试相关内容。${r.focus}${r.formula}

输出JSON：
{ "materialSummary":"概述", "chapters":[{ "title":"章", "keyConcepts":[], "formulas":[], "teacherEmphasis":[] }],
  "possibleExamPoints":[{ "title":"考点", "chapterTitle":"章", "evidence":[], "estimatedScoreMin":3, "estimatedScoreMax":8, "hitRate":0.85, "avgStudyMinutes":30, "targetTier":"pass", "importanceTier":"must", "formulas":[{ "name":"", "latex":"", "condition":"", "mnemonic":"" }], "commonPatterns":[], "solvingTemplate":[], "traps":[] }] }

字段：estimatedScoreMin/Max=占分, hitRate=概率0~1, avgStudyMinutes=补它耗时, targetTier=pass|75|85|all, importanceTier=must|important|optional|skip

资料：
---${rawText.slice(0, 8000)}---`
}

export const OutputSchema = z.object({
  materialSummary: z.string(),
  chapters: z.array(z.object({ title: z.string(), keyConcepts: z.array(z.string()), formulas: z.array(z.string()), teacherEmphasis: z.array(z.string()).optional() })),
  possibleExamPoints: z.array(z.object({
    title: z.string(), chapterTitle: z.string().optional(), evidence: z.array(z.string()),
    estimatedScoreMin: z.number(), estimatedScoreMax: z.number(), hitRate: z.number(), avgStudyMinutes: z.number(),
    targetTier: z.enum(["pass","75","85","all"]), importanceTier: z.enum(["must","important","optional","skip"]),
    formulas: z.array(z.object({ name: z.string().optional(), latex: z.string().optional(), condition: z.string().optional(), mnemonic: z.string().optional() })),
    commonPatterns: z.array(z.string()), solvingTemplate: z.array(z.string()), traps: z.array(z.string()),
  })),
})
