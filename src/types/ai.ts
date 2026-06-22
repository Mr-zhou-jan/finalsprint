export interface MaterialExtraction {
  materialSummary: string
  chapters: { title: string; keyConcepts: string[]; formulas: string[]; teacherEmphasis?: string[] }[]
  possibleExamPoints: { title: string; chapterTitle?: string; evidence: string[]; estimatedImportance?: number }[]
  // 视频特有
  timelineSegments?: { startTime: string; endTime: string; topic: string }[]
  skippableContent?: string[]  // 可跳过的非考试内容
  compressedSummary?: string   // 10分钟速通版摘要
}

export interface ExamPointOutput {
  examPoints: {
    title: string; chapterTitle?: string; summary: string
    estimatedScoreMin: number; estimatedScoreMax: number
    examProbability: number; studyCostMinutes: number
    targetTier: "pass" | "75" | "85"
    importanceTier: "must" | "important" | "optional" | "skip"
    roiScore: number; hitRate: number
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
  startScore: number; targetScore: number
  strategySummary: string
  dailyPlans: {
    day: number; date: string; goal: string; estimatedGain: number
    tasks: {
      examPointTitle: string
      taskType: "learn"|"practice"|"review"|"mock"
      priority: number; estimatedMinutes: number; expectedGain: number
      sourceReason: "weak_point"|"high_roi"|"exam_hotspot"|"error_retry"
      objective: string
    }[]
  }[]
}

export interface ExamScopeOutput {
  chapterTree: { chapter: string; topics: string[]; weight: number }[]
  coverage: number       // 当前资料覆盖度 0~1
  missingChapters: string[] // 未覆盖的章节
  confidence: "high"|"medium"|"low"
}

