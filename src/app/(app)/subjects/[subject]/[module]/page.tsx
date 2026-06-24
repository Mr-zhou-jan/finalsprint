"use client"

import { useParams } from "next/navigation"
import { SubjectShell, CrashCoursePanel, ScopeMapPanel, PracticeArena, SprintPlanPanel, MaterialsPanel, ReviewCenterPanel } from "@/components/subjects/subject-components"
import { SUBJECTS_CONFIG } from "@/data/subjects/subjects-config"
import {
  mathKnowledgePoints, mathCrashCourse, mathQuestions, mathSprintPlan, mathErrors,
  physicsKnowledgePoints, physicsCrashCourse, physicsQuestions, physicsSprintPlan, physicsErrors,
  mechanicsKnowledgePoints, mechanicsCrashCourse, mechanicsQuestions, mechanicsSprintPlan, mechanicsErrors,
  toleranceKnowledgePoints, toleranceCrashCourse, toleranceQuestions, toleranceSprintPlan, toleranceErrors,
  cppKnowledgePoints, cppCrashCourse, cppQuestions, cppSprintPlan, cppErrors,
} from "@/data/subjects"
import type { SubjectConfig } from "@/data/subjects/subject-types"

function buildConfig(subjectId: string): SubjectConfig | null {
  const base = SUBJECTS_CONFIG[subjectId as keyof typeof SUBJECTS_CONFIG]
  if (!base) return null
  const dataMap: Record<string, {
    knowledgePoints: typeof mathKnowledgePoints
    crashCourseBlocks: typeof mathCrashCourse
    practiceQuestions: typeof mathQuestions
    sprintPlanDays: typeof mathSprintPlan
    errorRecords: typeof mathErrors
  }> = {
    math: { knowledgePoints: mathKnowledgePoints, crashCourseBlocks: mathCrashCourse, practiceQuestions: mathQuestions, sprintPlanDays: mathSprintPlan, errorRecords: mathErrors },
    physics: { knowledgePoints: physicsKnowledgePoints, crashCourseBlocks: physicsCrashCourse, practiceQuestions: physicsQuestions, sprintPlanDays: physicsSprintPlan, errorRecords: physicsErrors },
    mechanics: { knowledgePoints: mechanicsKnowledgePoints, crashCourseBlocks: mechanicsCrashCourse, practiceQuestions: mechanicsQuestions, sprintPlanDays: mechanicsSprintPlan, errorRecords: mechanicsErrors },
    tolerance: { knowledgePoints: toleranceKnowledgePoints, crashCourseBlocks: toleranceCrashCourse, practiceQuestions: toleranceQuestions, sprintPlanDays: toleranceSprintPlan, errorRecords: toleranceErrors },
    cpp: { knowledgePoints: cppKnowledgePoints, crashCourseBlocks: cppCrashCourse, practiceQuestions: cppQuestions, sprintPlanDays: cppSprintPlan, errorRecords: cppErrors },
  }
  const data = dataMap[subjectId]
  if (!data) return null
  return { ...base, ...data }
}

export default function SubjectModulePage() {
  const params = useParams()
  const subjectId = params.subject as string
  const module = params.module as string
  const config = buildConfig(subjectId)
  if (!config) return <div className="min-h-screen flex items-center justify-center"><p className="text-zinc-500">学科未找到: {subjectId}</p></div>

  const panel = (() => {
    switch (module) {
      case "materials": return <MaterialsPanel domains={config.knowledgeDomains} />
      case "scope": return <ScopeMapPanel points={config.knowledgePoints} />
      case "crash": return <CrashCoursePanel blocks={config.crashCourseBlocks} />
      case "practice": return <PracticeArena questions={config.practiceQuestions} />
      case "sprint": return <SprintPlanPanel days={config.sprintPlanDays} />
      case "review": return <ReviewCenterPanel errors={config.errorRecords} />
      default: return <div className="text-center py-12 text-zinc-400"><p className="text-lg">未知模块: {module}</p></div>
    }
  })()

  return <SubjectShell config={config}>{panel}</SubjectShell>
}
