// M5: 考点冲刺卡
import { z } from "zod"
import { COACH_SYSTEM_PROMPT } from "./shared/system-prompts"
import { detectSubject, SUBJECT_RULES } from "./shared/subject-rules"

export const SYSTEM_PROMPT = COACH_SYSTEM_PROMPT

export function buildUserPrompt(point: { title: string; summary?: string | null; estimatedScoreMin: number | null; estimatedScoreMax: number | null }, subject: string): string {
  const r = SUBJECT_RULES[detectSubject(subject)] || SUBJECT_RULES.generic
  return `为考点"${point.title}"生成冲刺学习卡。概要：${point.summary||"暂无"}。占分：${point.estimatedScoreMin}~${point.estimatedScoreMax}。${r.formula}

输出JSON：
{ "howItIsTested":{ "commonTypes":[], "typicalScore":"通常X分", "typicalWording":[] },
  "quickLearn":{ "minimalConcept":"一句话定义", "mustMemorize":[{ "name":"","latex":"","condition":"","mnemonic":"" }], "recognitionSignals":[] },
  "solvingTemplate":["步骤1","步骤2","步骤3"],
  "commonTraps":[{ "trap":"错误","why":"原因","howToAvoid":"避免方法" }],
  "example":{ "question":"例题","solution":"解答","steps":["步骤"] } }

每个字段都要实质内容，不要写"根据实际情况"或"略"。`
}

export const OutputSchema = z.object({
  howItIsTested: z.object({ commonTypes: z.array(z.string()), typicalScore: z.string(), typicalWording: z.array(z.string()) }),
  quickLearn: z.object({ minimalConcept: z.string(), mustMemorize: z.array(z.object({ name: z.string(), latex: z.string(), condition: z.string(), mnemonic: z.string().optional() })), recognitionSignals: z.array(z.string()) }),
  solvingTemplate: z.array(z.string()),
  commonTraps: z.array(z.object({ trap: z.string(), why: z.string(), howToAvoid: z.string() })),
  example: z.object({ question: z.string(), solution: z.string(), steps: z.array(z.string()) }),
})
