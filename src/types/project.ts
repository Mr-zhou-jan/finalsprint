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
