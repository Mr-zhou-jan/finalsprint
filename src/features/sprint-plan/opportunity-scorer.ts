// 机会值计算：弱项≠优先学项，按提分性价比排序
import type { ComputeOpportunityInput, WeakOpportunity } from "@/types/algorithms"

export function computeWeakOpportunities(inputs: ComputeOpportunityInput[]): WeakOpportunity[] {
  return inputs.map(input => {
    const weakFactor = 1 - (input.confidenceScore / 100)
    const hitRate = input.hitRate ?? 0.5
    const scorePotential = ((input.estimatedScoreMin ?? 0) + (input.estimatedScoreMax ?? 0)) / 2
    const avgMinutes = input.avgStudyMinutes ?? 60
    const tierMatch = input.targetTier === input.userTargetTier || input.targetTier === "all"
    const tierMultiplier = tierMatch ? 1.0 : 0.3
    const opportunityScore = tierMultiplier * weakFactor * hitRate * scorePotential / Math.max(avgMinutes, 1)
    const expectedGain = Math.round(weakFactor * scorePotential * hitRate)
    const reasonTags: string[] = []
    if (hitRate >= 0.85) reasonTags.push("高频")
    if (scorePotential >= 6) reasonTags.push("大题")
    if (avgMinutes <= 30) reasonTags.push("速补")
    if (input.importanceTier === "must") reasonTags.push("必学")
    if (weakFactor > 0.7) reasonTags.push("薄弱")
    return { examPointId: input.examPointId, examPointTitle: input.title, currentMastery: input.confidenceScore, opportunityScore: Math.round(opportunityScore * 100) / 100, expectedGain, estimatedMinutes: avgMinutes, reasonTags }
  }).sort((a, b) => {
    if (Math.abs(a.opportunityScore - b.opportunityScore) < 0.01) return b.expectedGain - a.expectedGain
    return b.opportunityScore - a.opportunityScore
  })
}
