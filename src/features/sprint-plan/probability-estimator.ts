// 达标概率估算
import type { EstimateProbabilityInput, ProbabilityResult } from "@/types/algorithms"

export function estimateReachProbability(input: EstimateProbabilityInput): ProbabilityResult {
  const { predictedMin, predictedMax, targetScore, daysLeft, dailyMinutes, overallCoverage, recentCompletionRate } = input
  const predictedMid = (predictedMin + predictedMax) / 2
  let passProbability = predictedMax >= 60 ? Math.min(0.95, 0.5 + 0.45 * (predictedMax - predictedMin) / 20) : (predictedMax / 60) * 0.5
  let targetProbability = predictedMax >= targetScore ? passProbability * 0.8 : (predictedMax / targetScore) * passProbability * 0.6
  const coverage = overallCoverage ?? 0.5
  if (coverage < 0.7) { passProbability *= 0.7 + coverage * 0.3; targetProbability *= 0.7 + coverage * 0.3 }
  const cr = recentCompletionRate
  const completionRisk = cr >= 0.7 ? "low" : cr >= 0.4 ? "medium" : "high"
  if (completionRisk === "high") { passProbability *= 0.7; targetProbability *= 0.6 }
  else if (completionRisk === "medium") { passProbability *= 0.85; targetProbability *= 0.8 }
  const dailyGain = daysLeft > 0 ? predictedMid * 0.05 : 0
  const predictedIfOnTrack = Math.round(predictedMid + dailyGain * Math.min(daysLeft, 14) * Math.min(cr, 1))
  const warnings: string[] = []
  if (coverage < 0.6) warnings.push(`资料仅覆盖 ${Math.round(coverage * 100)}%`)
  if (completionRisk !== "low") warnings.push(`任务完成率 ${Math.round(cr * 100)}%`)
  if (predictedIfOnTrack < targetScore) warnings.push(`预计只能达到 ${predictedIfOnTrack} 分`)
  if (passProbability < 0.5) warnings.push("挂科风险较高")
  return { passProbability: Math.round(passProbability * 100) / 100, targetProbability: Math.round(targetProbability * 100) / 100, predictedIfOnTrack, completionRisk, warnings }
}
