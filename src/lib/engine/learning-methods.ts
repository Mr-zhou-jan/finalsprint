export type SubjectCategory = "language" | "programming" | "theory" | "finance" | "math" | "general"

export function classifySubject(name: string): SubjectCategory {
  const lower = name.toLowerCase()
  if (/英语|英文|cet|四级|六级|雅思|托福/.test(lower)) return "language"
  if (/c\+\+|python|java|编程/.test(lower)) return "programming"
  if (/高数|数学|线性代数|微积分/.test(lower)) return "math"
  if (/物理|力学|电磁|化学/.test(lower)) return "theory"
  return "general"
}

export function isCalcSubject(name: string): boolean {
  return classifySubject(name) === "math" || classifySubject(name) === "theory"
}

export function getCalcPrompt(node: { title: string; description: string }, difficulty: string): string {
  return "generate calculation problem"
}

export interface LearningMethod {
  id: string; name: string; description: string; icon: string
  suitableFor: SubjectCategory[]
  steps: { type: string; title: string; description: string; durationMin: number }[]
}

export function recommendMethods(category: SubjectCategory, count: number = 3): LearningMethod[] {
  return []
}

export function getSubjectApproach(category: SubjectCategory): string {
  return ""
}
