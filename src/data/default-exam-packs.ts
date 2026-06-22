// 默认考纲包：无资料时的保底方案

export interface DefaultExamPoint {
  title: string; chapterTitle: string
  estimatedScoreMin: number; estimatedScoreMax: number
  hitRate: number; avgStudyMinutes: number
  targetTier: "pass" | "75" | "85" | "all"
  importanceTier: "must" | "important" | "optional" | "skip"
}

export interface DefaultExamPack {
  subjectPattern: string[]
  disclaimer: string
  points: DefaultExamPoint[]
}

export const ADVANCED_MATH_PACK: DefaultExamPack = {
  subjectPattern: ["高等数学", "高数", "微积分", "advanced math", "calculus"],
  disclaimer: "当前未上传老师资料，预测基于通用高数考纲，准确性较低。强烈建议上传老师划的重点和往年题。",
  points: [
    { title: "极限计算（代入法+因式分解）", chapterTitle: "函数与极限", estimatedScoreMin: 5, estimatedScoreMax: 10, hitRate: 0.95, avgStudyMinutes: 30, targetTier: "pass", importanceTier: "must" },
    { title: "等价无穷小替换", chapterTitle: "函数与极限", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.90, avgStudyMinutes: 25, targetTier: "pass", importanceTier: "must" },
    { title: "两个重要极限", chapterTitle: "函数与极限", estimatedScoreMin: 3, estimatedScoreMax: 6, hitRate: 0.85, avgStudyMinutes: 20, targetTier: "pass", importanceTier: "must" },
    { title: "洛必达法则求极限", chapterTitle: "函数与极限", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.80, avgStudyMinutes: 25, targetTier: "pass", importanceTier: "important" },
    { title: "导数定义与基本求导公式", chapterTitle: "导数与微分", estimatedScoreMin: 5, estimatedScoreMax: 10, hitRate: 0.95, avgStudyMinutes: 30, targetTier: "pass", importanceTier: "must" },
    { title: "复合函数求导（链式法则）", chapterTitle: "导数与微分", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.90, avgStudyMinutes: 25, targetTier: "pass", importanceTier: "must" },
    { title: "隐函数与参数方程求导", chapterTitle: "导数与微分", estimatedScoreMin: 3, estimatedScoreMax: 6, hitRate: 0.75, avgStudyMinutes: 30, targetTier: "75", importanceTier: "important" },
    { title: "函数单调性与极值", chapterTitle: "中值定理与导数应用", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.95, avgStudyMinutes: 40, targetTier: "pass", importanceTier: "must" },
    { title: "函数最值应用题", chapterTitle: "中值定理与导数应用", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.85, avgStudyMinutes: 35, targetTier: "75", importanceTier: "important" },
    { title: "罗尔定理与拉格朗日定理", chapterTitle: "中值定理与导数应用", estimatedScoreMin: 2, estimatedScoreMax: 6, hitRate: 0.70, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "不定积分基本公式", chapterTitle: "不定积分", estimatedScoreMin: 5, estimatedScoreMax: 10, hitRate: 0.95, avgStudyMinutes: 35, targetTier: "pass", importanceTier: "must" },
    { title: "凑微分法（第一类换元）", chapterTitle: "不定积分", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.95, avgStudyMinutes: 45, targetTier: "pass", importanceTier: "must" },
    { title: "分部积分法", chapterTitle: "不定积分", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.85, avgStudyMinutes: 35, targetTier: "75", importanceTier: "important" },
    { title: "定积分换元法", chapterTitle: "定积分", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.95, avgStudyMinutes: 45, targetTier: "pass", importanceTier: "must" },
    { title: "变上限积分求导", chapterTitle: "定积分", estimatedScoreMin: 3, estimatedScoreMax: 6, hitRate: 0.80, avgStudyMinutes: 30, targetTier: "75", importanceTier: "important" },
    { title: "定积分面积应用", chapterTitle: "定积分", estimatedScoreMin: 3, estimatedScoreMax: 10, hitRate: 0.75, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "可分离变量微分方程", chapterTitle: "微分方程", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.85, avgStudyMinutes: 35, targetTier: "pass", importanceTier: "must" },
    { title: "一阶线性微分方程", chapterTitle: "微分方程", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.80, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "二阶常系数齐次线性方程", chapterTitle: "微分方程", estimatedScoreMin: 2, estimatedScoreMax: 6, hitRate: 0.70, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "多元函数偏导数", chapterTitle: "多元函数微分", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.70, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "二重积分直角坐标计算", chapterTitle: "重积分", estimatedScoreMin: 3, estimatedScoreMax: 10, hitRate: 0.65, avgStudyMinutes: 50, targetTier: "75", importanceTier: "important" },
    { title: "级数敛散性判别", chapterTitle: "无穷级数", estimatedScoreMin: 2, estimatedScoreMax: 6, hitRate: 0.55, avgStudyMinutes: 50, targetTier: "85", importanceTier: "optional" },
  ],
}

export const PHYSICS_PACK: DefaultExamPack = {
  subjectPattern: ["大学物理", "物理", "普通物理", "physics"],
  disclaimer: "当前未上传老师资料，预测基于通用大学物理考纲，准确性较低。强烈建议上传老师划的重点和往年题。",
  points: [
    { title: "质点运动学（位移/速度/加速度）", chapterTitle: "质点运动学", estimatedScoreMin: 5, estimatedScoreMax: 10, hitRate: 0.90, avgStudyMinutes: 35, targetTier: "pass", importanceTier: "must" },
    { title: "牛顿三大定律应用", chapterTitle: "牛顿定律", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.95, avgStudyMinutes: 40, targetTier: "pass", importanceTier: "must" },
    { title: "动量守恒与能量守恒", chapterTitle: "动量与能量", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.95, avgStudyMinutes: 45, targetTier: "pass", importanceTier: "must" },
    { title: "刚体定轴转动", chapterTitle: "刚体转动", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.80, avgStudyMinutes: 45, targetTier: "75", importanceTier: "important" },
    { title: "简谐振动", chapterTitle: "振动与波", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.75, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "理想气体状态方程", chapterTitle: "热学", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.80, avgStudyMinutes: 35, targetTier: "pass", importanceTier: "must" },
    { title: "热力学第一定律", chapterTitle: "热学", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.75, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "电场与高斯定理", chapterTitle: "静电场", estimatedScoreMin: 5, estimatedScoreMax: 12, hitRate: 0.90, avgStudyMinutes: 50, targetTier: "pass", importanceTier: "must" },
    { title: "电势与电势能", chapterTitle: "静电场", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.80, avgStudyMinutes: 40, targetTier: "75", importanceTier: "important" },
    { title: "安培环路定理", chapterTitle: "磁场", estimatedScoreMin: 3, estimatedScoreMax: 8, hitRate: 0.75, avgStudyMinutes: 45, targetTier: "75", importanceTier: "important" },
    { title: "法拉第电磁感应定律", chapterTitle: "电磁感应", estimatedScoreMin: 3, estimatedScoreMax: 10, hitRate: 0.80, avgStudyMinutes: 45, targetTier: "75", importanceTier: "important" },
  ],
}

const allPacks = [ADVANCED_MATH_PACK, PHYSICS_PACK]

export function getDefaultPack(subjectName: string): DefaultExamPack | null {
  const lower = subjectName.toLowerCase()
  return allPacks.find(p => p.subjectPattern.some(pat => lower.includes(pat.toLowerCase()))) || null
}

export function getGenericFallbackDisclaimer(): string {
  return "当前未上传老师资料，预测基于通用考纲，准确性较低。强烈建议上传老师划的重点和往年题。"
}
