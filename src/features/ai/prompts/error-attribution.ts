// M6: 错题归因
import { z } from "zod"
import { GRADER_SYSTEM_PROMPT } from "./shared/system-prompts"

export const SYSTEM_PROMPT = GRADER_SYSTEM_PROMPT

export function buildUserPrompt(q: { stem: string; type: string; options?: any; answer: any }, userAnswer: any, pointTitle: string): string {
  return `分析错题。类型：${q.type}。题目：${q.stem}。${q.options?`选项：${JSON.stringify(q.options)}` : ""}
标准答案：${JSON.stringify(q.answer)}。学生答案：${JSON.stringify(userAnswer)}。考点：${pointTitle}。

输出JSON：{ "errorType":"concept", "reason":"原因", "reviewPoint":"回顾知识点", "suggestedAction":"补救动作", "similarQuestion":{ "stem":"类似题", "answer":{"correctIndex":0} } }
errorType: concept(概念不清)|formula(公式记错)|calculation(计算错)|careless(审题)|no_idea(完全不会)`
}

export const OutputSchema = z.object({
  errorType: z.enum(["concept","formula","calculation","careless","no_idea"]),
  reason: z.string(), reviewPoint: z.string(), suggestedAction: z.string(),
  similarQuestion: z.object({ stem: z.string(), answer: z.union([z.object({ correctIndex: z.number() }), z.object({ value: z.string() })]) }).optional(),
})
