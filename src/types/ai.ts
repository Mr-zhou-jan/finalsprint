export interface MaterialExtraction {
  materialSummary: string
  chapters: { title: string; keyConcepts: string[]; formulas: string[]; teacherEmphasis?: string[] }[]
  possibleExamPoints: { title: string; chapterTitle?: string; evidence: string[]; estimatedImportance?: number }[]
}

export interface ExamPointOutput {
  examPoints: {
    title: string; chapterTitle?: string; summary: string
    examProbability: number; estimatedScore: number; studyCostMinutes: number
    targetTier: "pass" | "75" | "85"; importanceLevel: 1|2|3|4|5
    formulas: { name?: string; latex?: string; note?: string }[]
    commonPatterns: string[]; solvingTemplate: string[]; traps: string[]; sourceEvidence: string[]
  }[]
}

export interface DiagnosticReport {
  predictedMin: number; predictedMax: number; overallSummary: string
  strengths: string[]
  weaknesses: { examPointTitle: string; reason: string; urgency: "high"|"medium"|"low"; expectedGain: number }[]
  recommendedFocus: string[]
}

export interface SprintPlanOutput {
  targetTier: "pass"|"75"|"85"; totalDays: number
  dailyPlans: {
    day: number; goal: string; estimatedGain: number
    tasks: { examPointTitle: string; taskType: "learn"|"practice"|"review"; durationMinutes: number; questionCount?: number; objective: string }[]
  }[]
}
