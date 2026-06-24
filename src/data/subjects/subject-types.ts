// ===== 学科工作台核心类型定义 =====

/** 考试任务 */
export interface ExamMission {
  id: string
  subjectId: string
  subjectName: string
  courseName: string
  examDate: string
  targetScore: number
  currentLevel: "zero" | "basic" | "mid"
  dailyStudyMinutes: number
  passLine?: number
  strategyMode: "pass" | "score80" | "score90"
  createdAt: string
}

/** 学习资料 */
export interface Material {
  id: string
  missionId: string
  subjectId: string
  type: "bilibili" | "pdf" | "ppt" | "exam_paper" | "text_scope"
  title: string
  sourceUrl?: string
  rawText?: string
  parsedOutline?: string[]
  processingStatus: "pending" | "done" | "failed"
}

/** 知识点 */
export interface KnowledgePoint {
  id: string
  subjectId: string
  chapter: string
  title: string
  summary: string
  importance: 1 | 2 | 3 | 4 | 5
  masteryLevel: 0 | 1 | 2 | 3 | 4
  mustMemorize?: string[]
  commonTraps?: string[]
  typicalQuestionTypes?: string[]
}

/** 速通讲义块 */
export interface CrashCourseBlock {
  id: string
  subjectId: string
  chapter: string
  title: string
  oneLineUnderstanding: string
  examApproach: string
  mustMemorize: string[]
  example: { question: string; solution: string; answer: string }
  traps: string[]
  minPassLevel: string
}

/** 练习题 */
export interface PracticeQuestion {
  id: string
  subjectId: string
  chapter: string
  type: "choice" | "fill" | "calc" | "proof" | "program"
  difficulty: "easy" | "mid" | "hard"
  stem: string
  options?: string[]
  correctIndex?: number
  answer?: string
  explanation: string
  relatedKnowledgePoint: string
  tags: string[]
}

/** 冲刺计划 — 单日任务 */
export interface DailySprintTask {
  id: string
  missionId: string
  dayIndex: number
  title: string
  tasks: {
    type: "learn" | "practice" | "review"
    content: string
    estimatedMinutes: number
  }[]
  status: "todo" | "done"
}

/** 错题记录 */
export interface ErrorRecord {
  id: string
  subjectId: string
  questionStem: string
  userAnswer: string
  correctAnswer: string
  errorReason: "concept" | "formula" | "careless" | "no_idea"
  relatedChapter: string
  relatedPoint: string
  createdAt: string
}

/** 学科配置 */
export interface SubjectConfig {
  subjectId: string
  subjectName: string
  icon: string
  color: string
  examTypes: readonly string[]
  knowledgeDomains: readonly string[]
  knowledgePoints: KnowledgePoint[]
  crashCourseBlocks: CrashCourseBlock[]
  practiceQuestions: PracticeQuestion[]
  sprintPlanDays: DailySprintTask[]
  errorRecords: ErrorRecord[]
}