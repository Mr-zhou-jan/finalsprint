// ====== 4 核心算法：固定输入/固定输出类型签名 ======

// ---- 1) 机会值计算 ----
export interface ComputeOpportunityInput {
  examPointId: string
  title: string
  estimatedScoreMin: number | null
  estimatedScoreMax: number | null
  hitRate: number | null
  avgStudyMinutes: number | null
  targetTier: string | null
  importanceTier: string | null
  confidenceScore: number
  userTargetTier: "pass" | "75" | "85"
  daysLeft: number
}

export interface WeakOpportunity {
  examPointId: string
  examPointTitle: string
  currentMastery: number
  opportunityScore: number
  expectedGain: number
  estimatedMinutes: number
  reasonTags: string[]
}

// ---- 2) 路线生成 ----
export interface PointMastery {
  examPointId: string
  confidenceScore: number
  masteryStatus: "unknown" | "weak" | "pass" | "good"
}

export interface StudyTaskDraft {
  examPointId?: string
  title: string
  taskType: "learn" | "practice" | "review" | "mock"
  priority: number
  estimatedMinutes: number
  expectedGain: number
  sourceReason: "weak_point" | "high_roi" | "exam_hotspot" | "error_retry" | "coverage_gap"
  day: number
  date: string
}

export interface GenerateSprintPlanInput {
  targetScore: number
  dailyMinutes: number
  currentLevel: string
  targetTier: "pass" | "75" | "85"
  daysLeft: number
  overallCoverage: number | null
  examPoints: {
    id: string; title: string
    estimatedScoreMin: number | null; estimatedScoreMax: number | null
    hitRate: number | null; avgStudyMinutes: number | null
    targetTier: string | null; importanceTier: string | null
  }[]
  masteries: PointMastery[]
}

export interface SprintPlanOutput {
  routeTier: "pass" | "75" | "85"
  estimatedCurrentScore: number
  estimatedTargetReachProbability: number
  totalEstimatedGain: number
  totalEstimatedMinutes: number
  strategySummary: string
  abandonAdvice: string[]
  tasks: StudyTaskDraft[]
}

// ---- 3) 概率估算 ----
export interface EstimateProbabilityInput {
  predictedMin: number
  predictedMax: number
  targetScore: number
  daysLeft: number
  dailyMinutes: number
  overallCoverage: number | null
  recentCompletionRate: number
}

export interface ProbabilityResult {
  passProbability: number
  targetProbability: number
  predictedIfOnTrack: number
  completionRisk: "low" | "medium" | "high"
  warnings: string[]
}

// ---- 4) 重算触发器 ----
export type RecalcTrigger =
  | { type: "first_diagnostic"; diagnosticRunId: string }
  | { type: "params_changed"; changedFields: string[] }
  | { type: "low_completion"; consecutiveDaysBelow60: number }
  | { type: "score_jump"; scoreDelta: number }
  | { type: "new_material"; materialId: string }

export interface RecalcDecision {
  shouldRecalc: boolean
  recalcRange: "full" | "future_unlocked" | "next_3_days" | "next_5_days"
  reason: string
  tasksToLock: string[]
  tasksToInvalidate: string[]
}
