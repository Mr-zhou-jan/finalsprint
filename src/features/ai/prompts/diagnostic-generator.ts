// M2: 诊断题生成
import { z } from "zod"
import { COACH_SYSTEM_PROMPT } from "./shared/system-prompts"
import { detectSubject, SUBJECT_RULES } from "./shared/subject-rules"

export const SYSTEM_PROMPT = COACH_SYSTEM_PROMPT

export function buildUserPrompt(points: { title: string; importanceTier: string }[], subjectName: string, targetScore: number, level: string): string {
  const r = SUBJECT_RULES[detectSubject(subjectName)] || SUBJECT_RULES.generic
  const list = points.map(p => `- ${p.title} (${p.importanceTier})`).join("\n")
  return `生成诊断题。目标${targetScore}分，基础${level}。考点：\n${list}\n\n题型：${r.qTypes}。难度：基础40%+中等40%+困难20%。must≥2题，important≥1题。总10~20题。

输出JSON：{ "questions":[{ "type":"single", "difficulty":2, "stem":"题目", "options":["A.","B.","C.","D."], "answer":{"correctIndex":0}, "explanation":"解析", "examPointTitle":"考点" }] }

注意：答案必须确实正确。解释要具体。计算题不需要options，answer用{"value":"答案"}。`
}

export const OutputSchema = z.object({
  questions: z.array(z.object({
    type: z.enum(["single","fill","calculation"]), difficulty: z.number().min(1).max(5), stem: z.string(),
    options: z.array(z.string()).optional(),
    answer: z.union([z.object({ correctIndex: z.number() }), z.object({ value: z.string() })]),
    explanation: z.string(), examPointTitle: z.string(),
  })),
})
