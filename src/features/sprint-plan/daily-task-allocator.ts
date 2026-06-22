// 每日任务分配器
import type { StudyTaskDraft, WeakOpportunity } from "@/types/algorithms"

export interface AllocateInput {
  opportunities: WeakOpportunity[]; dailyMinutes: number
  targetTier: "pass" | "75" | "85"; daysLeft: number; overallCoverage: number | null
}

export function allocateDailyTasks(input: AllocateInput) {
  const { opportunities, dailyMinutes, daysLeft, overallCoverage } = input
  const tasks: StudyTaskDraft[] = []
  const dayMinutes = new Array(Math.max(daysLeft, 1)).fill(0)
  let day = 0; let streak = 0; let totalGain = 0; let totalMins = 0
  const active = opportunities.filter(o => o.opportunityScore > 0.01)

  for (const opp of active) {
    if (day >= daysLeft) break
    const lm = opp.estimatedMinutes; const pm = Math.ceil(lm * 0.3)
    if (dayMinutes[day] + lm <= dailyMinutes * 0.75) {
      const ds = getDate(day)
      tasks.push({ examPointId: opp.examPointId, title: opp.examPointTitle, taskType: "learn", priority: 1, estimatedMinutes: lm, expectedGain: opp.expectedGain, sourceReason: opp.reasonTags.includes("薄弱") ? "weak_point" : "high_roi", day: day + 1, date: ds })
      dayMinutes[day] += lm; totalGain += opp.expectedGain; totalMins += lm; streak++
      if (streak >= 2 && dayMinutes[day] + pm <= dailyMinutes) {
        tasks.push({ title: `${opp.examPointTitle} - 练习`, taskType: "practice", priority: 2, estimatedMinutes: pm, expectedGain: Math.ceil(opp.expectedGain * 0.3), sourceReason: "high_roi", day: day + 1, date: ds })
        dayMinutes[day] += pm; totalMins += pm; streak = 0
      }
    } else { day++; streak = 0; continue }
    if (dayMinutes[day] >= dailyMinutes * 0.85) { day++; streak = 0 }
  }

  // 最后一天 → review
  for (const t of tasks.filter(t => t.day === daysLeft && t.taskType === "learn")) {
    t.taskType = "review"; t.title += " - 考前速查"; t.estimatedMinutes = Math.ceil(t.estimatedMinutes * 0.4)
  }

  const strategySummary = `预计 ${daysLeft} 天可提升约 ${totalGain} 分，总耗时约 ${totalMins} 分钟。`
  const abandonAdvice = opportunities.filter(o => o.opportunityScore <= 0.01).slice(0, 3).map(o => o.examPointTitle)
  if ((overallCoverage ?? 0.5) < 0.6) abandonAdvice.push("注意：资料覆盖不足")

  return { tasks: tasks.sort((a, b) => a.day - b.day || a.priority - b.priority), strategySummary, abandonAdvice, totalEstimatedGain: totalGain, totalEstimatedMinutes: totalMins }
}

function getDate(offset: number): string { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().split("T")[0] }
