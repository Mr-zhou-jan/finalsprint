import { z } from "zod"

export const CreateProjectSchema = z.object({
  subjectName: z.string().min(1, "请输入科目名称"),
  examDate: z.string().min(1, "请选择考试日期"),
  targetScore: z.number().min(1).max(100),
  currentLevel: z.enum(["zero", "weak", "average"]),
  dailyMinutes: z.number().min(10).max(600),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type ExamPointTier = "pass" | "75" | "85"
export type MasteryStatus = "unknown" | "weak" | "pass" | "good"
export type QuestionType = "choice" | "fill" | "calc"

export interface Formula {
  name: string
  latex: string
  note: string
}

export interface Problem {
  question: string
  answer: string
  solution: string
  steps: string[]
}

export interface ProblemType {
  name: string
  examFrequency: string
  example: Problem
  practice: Problem
}

export interface SpeedRunQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ChapterContent {
  subject: string
  chapter: string
  examWeight: number
  examScore: string
  formulas: Formula[]
  problemTypes: ProblemType[]
  traps: string[]
  speedRun: SpeedRunQuestion[]
}

export interface SubjectIndex {
  name: string
  weight: number
  score: string
}