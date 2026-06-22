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
    hitRate: number; avgStudyMinutes: number
    targetTier: "pass" | "75" | "85" | "all"
    importanceTier: "must" | "important" | "optional" | "skip"
    roiScore: number
    formulas: { name?: string; latex?: string; note?: string }[]
    commonPatterns: string[]; solvingTemplate: string[]; traps: string[]; sourceEvidence: string[]
  }[]
}

export interface CrashSummary {
  summaryVersion: "v1"
  sections: { title: string; examPoints: string[]; mustRemember: string[]; commonTraps: string[]; representativeQuestionTypes: string[]; skipable: boolean }[]
  finalCheatSheet: string[]
}

export interface PointCoverageEntry {
  pointId: string; covered: boolean; sourceMaterialIds: string[]; confidence: number
}

export interface DiagnosticReport {
  predictedMin: number; predictedMax: number; overallSummary: string
  strengths: string[]
  weaknesses: { examPointTitle: string; reason: string; urgency: "high"|"medium"|"low"; expectedGain: number }[]
  recommendedFocus: string[]
}

export interface WeakOpportunity {
  examPointTitle: string; currentMastery: number
  estimatedMinutes: number; expectedGain: number
  reason: string // 高频+基础大题稳定拿分 / etc
}

export interface SprintPlanOutput {
  targetTier: "pass"|"75"|"85"; totalDays: number
  startScore: number; targetScore: number
  strategySummary: string
  abandonAdvice: string[]   // 建议放弃的考点
  totalEstimatedGain: number
  totalEstimatedMinutes: number
  dailyPlans: {
    day: number; date: string; goal: string; estimatedGain: number
    tasks: {
      examPointTitle: string
      taskType: "learn"|"practice"|"review"|"mock"
      priority: number; estimatedMinutes: number; expectedGain: number
      sourceReason: "weak_point"|"high_roi"|"exam_hotspot"|"error_retry"|"coverage_gap"
      objective: string
    }[]
  }[]
}

export interface ExamScopeOutput {
  chapterTree: { chapter: string; topics: string[]; weight: number }[]
  overallCoverage: number
  pointCoverageMap: { pointId: string; covered: boolean; sourceMaterialIds: string[]; confidence: number }[]
  missingChapters: string[]
  confidence: "high"|"medium"|"low"
}

export interface RiskReport {
  passProbability: number    // 保过概率 0~1
  targetProbability: number  // 达标概率 0~1
  coverageGap: number        // 资料覆盖缺口 1-overallCoverage
  completionRisk: "low"|"medium"|"high" // 任务完成率风险
  predictedIfOnTrack: number // 按计划执行的预测分
  warnings: string[]         // 风险提示文本
}

