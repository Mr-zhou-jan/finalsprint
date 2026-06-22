# FinalSprint Sprint 2 — 开发文档（Claude Code 执行版）

> 版本: v1.0 | 日期: 2026-06-22 | 前提: Sprint 1 + 产品收口补丁已完成

## 1. Sprint 目标

**一句话**：用户上传资料后，30 分钟内走完"诊断→提分路线→今日任务→驾驶舱"完整闭环。

| 编号 | 模块 | 用户感知 |
|------|------|----------|
| S2-1 | 诊断考试闭环 | "我能考几分？差多少及格？最该补哪？" |
| S2-2 | 提分路线生成器 | "按什么顺序学，单位时间提分最高？" |
| S2-3 | 今日冲刺任务页 | "今天 2 小时具体干什么？" |
| S2-4 | 冲刺驾驶舱 v1 | "当前估分/距目标/达标概率/今日完成后估分" |

## 2. 功能边界

### 必须做
- 诊断卷自动生成（从 ExamPoint 抽题）
- 诊断作答页（选择/填空/计算）
- AI 自动判分 + 分步解析
- 诊断报告页（估分区间 + 弱项机会列表 + 达标概率）
- 提分路线生成（三档：保60/冲75/冲85）
- SprintPlan + StudyTask 入库
- 今日任务页（按优先级排列 + 预计提分 + 预计耗时）
- 冲刺驾驶舱 v1（4卡片 + 风险提示 + Top3机会 + 今日任务入口）

### 不做（S3/S4）
考点冲刺卡（teach-me）、专项刷题页、错题回炉页、模拟考场、视频链接解析管线、资料解析审查页 UI

## 3. 核心算法

### 3.1 弱项机会值计算

```
opportunityScore = weakFactor × hitRate × scorePotential / avgStudyMinutes

weakFactor      = 1 - (confidenceScore / 100)
hitRate         = ExamPoint.hitRate (默认 0.5)
scorePotential  = (estimatedScoreMin + estimatedScoreMax) / 2
avgStudyMinutes = ExamPoint.avgStudyMinutes (默认 60)
```

排序：opportunityScore 降序 → importanceTier=must 优先 → targetTier 不匹配的排到最后

### 3.2 提分路线生成

```
1. 筛选 targetTier 匹配的考点
2. 按 opportunityScore 降序
3. 按天分配（每天总时长 ≤ dailyMinutes）
   每 2 个 learn → 1 个 practice
   每 3 天 → 1 个 review
   最后 1 天 → 仅 review
4. 生成 strategySummary + abandonAdvice
```

### 3.3 达标概率估算

```
passProbability =
  if predictedMax >= 60: min(0.95, 0.5 + 0.45 × (predictedMax-predictedMin)/20)
  else: predictedMax/60 × 0.5

targetProbability =
  if predictedMax >= targetScore: passProbability × 0.8
  else: (predictedMax/targetScore) × passProbability × 0.6
```

### 3.4 SprintPlan 重算触发器

| 触发器 | 条件 | 重算范围 |
|--------|------|----------|
| A: 首次诊断 | DiagnosticRun 创建 | 全量生成 |
| B: 参数变更 | 目标分/日期/时长变化 | 未来未锁定任务 |
| C: 完成率低 | 连续2天 < 60% | 未来3天重排 |
| D: 分数突变 | 估分变化 > 10分 | 未来5天重排 |
| E: 新资料 | 新 Material 入库 | 更新 ExamScope + 重算未锁定 |

重算规则：`isLocked=true` 不改，`status=done` 不改，其他未来任务可替换

## 4. API 设计

### `POST /api/projects/[id]/diagnostic/generate`
生成诊断卷。从 importanceTier∈{must,important} 考点按 hitRate 抽题。
难度：基础40%+中等40%+困难20%。题型：选择60%+填空25%+计算15%。
总题数 min(examPoints×1.5, 20)，最少10题。
响应：`{ diagnosticId, questions[], totalQuestions, estimatedMinutes }`

### `POST /api/projects/[id]/diagnostic/submit`
提交诊断答案，返回：
```json
{
  "correctCount": 8, "totalQuestions": 15,
  "predictedMin": 42, "predictedMax": 55,
  "weakOpportunities": [{ "examPointTitle":"...", "currentMastery":25, "estimatedMinutes":45, "expectedGain":6, "reason":"高频基础大题" }],
  "riskReport": { "passProbability":0.62, "targetProbability":0.28, "coverageGap":0.42, "completionRisk":"medium", "predictedIfOnTrack":63, "warnings":["资料仅覆盖58%"] }
}
```

### `POST /api/projects/[id]/plan/generate`
生成/重算 SprintPlan。请求：`{ targetTier }`
响应：`{ planId, targetTier, totalDays, startScore, targetScore, totalEstimatedGain, strategySummary, abandonAdvice[], dailyPlans[{day,date,goal,estimatedGain,tasks[]}] }`

### `GET /api/projects/[id]/plan/today`
获取今日任务：`{ date, dayNumber, tasks[], totalEstimatedMinutes, totalExpectedGain, predictedAfterToday }`

### `PATCH /api/projects/[id]/plan/tasks/[taskId]`
更新任务状态：`{ status }`

### `GET /api/projects/[id]/dashboard`
驾驶舱聚合数据：`{ currentScore, targetScore, scoreGap, passProbability, targetProbability, predictedAfterToday, topOpportunities[], riskWarnings[], todayTasks[], coverageGap }`

## 5. 页面 PRD

### 5.1 诊断作答页 (`/diagnostic/take`)
- 顶部进度条(第X/N题) + 题目区(选择/填空/计算) + 底部(上一题/下一题/提交)
- 选择题点击选中，填空/计算回车确认
- 全部答完前「提交」disabled；关闭页面弹窗确认
- 状态：loading(骨架屏)/作答中/已提交→跳转报告

### 5.2 诊断报告页 (`/diagnostic/report`)
- 核心指标：估分区间 + 正确率 + 差距
- 达标概率：保过概率(进度条) + 目标概率(进度条)
- 🥇🥈🥉 Top 3 弱项机会(掌握%/耗时/预计提分/原因)
- 各考点得分详情(可折叠列表)
- 按钮：「重新诊断」「生成提分路线 →」

### 5.3 今日冲刺任务页 (`/plan`)
- 三档 Tab：保60/冲75/冲85
- 策略摘要(文字+总预计提分+总耗时)
- 今日任务(按优先级分组)：
  - 🔴 高优先：每条显示 taskType/标题/耗时/提分/原因/[开始]
  - 🟡 中优先
  - ⚪ 可放弃(目标60分用户不建议)
- 底部：今日完成后预计估分 + [标记今日完成]
- 空状态："尚未生成计划"/"今日任务已完成🎉"

### 5.4 冲刺驾驶舱 v1 (`/overview` 重构)
- 顶部4卡片：当前估分/距目标/达标概率(保过%+目标%)/今日完成后估分
- 中部：Top3 最值得补的考点(🥇🥈🥉)
- 风险提示区：资料覆盖/完成率/投入建议
- 底部：今日任务入口(数量+耗时+提分)

## 6. AI Prompt 清单

| Prompt | 用途 | 输出 Schema |
|--------|------|-------------|
| `diagnostic-generator.ts` | 生成诊断题 | `{questions: {type,stem,options?,answer,explanation,examPointTitle}[]}` |
| `diagnostic-grader.ts` | 批改计算题 | `{correct,explanation}` |
| `diagnostic-report.ts` | 诊断报告 | `WeakOpportunity[] + RiskReport` |
| `sprint-plan.ts` | 冲刺计划 | `SprintPlanOutput` |

## 7. 文件产出清单

### 新建文件
```
src/app/(app)/projects/[projectId]/diagnostic/
  start/page.tsx              # 诊断说明页
  take/page.tsx               # 诊断作答页
  report/page.tsx             # 诊断报告页

src/app/(app)/projects/[projectId]/plan/
  page.tsx                    # 冲刺任务页（完整页）

src/features/diagnostic/
  diagnostic-generator.service.ts
  diagnostic-grader.service.ts
  diagnostic-report.service.ts

src/features/sprint-plan/
  sprint-plan.service.ts
  opportunity-scorer.ts
  daily-task-allocator.ts
  probability-estimator.ts

src/features/ai/prompts/
  diagnostic-generator.ts
  diagnostic-grader.ts
  diagnostic-report.ts
  sprint-plan.ts

src/app/api/projects/[id]/diagnostic/
  generate/route.ts
  submit/route.ts

src/app/api/projects/[id]/plan/
  generate/route.ts
  today/route.ts
  tasks/[taskId]/route.ts

src/app/api/projects/[id]/dashboard/
  route.ts

src/components/diagnostic/
  QuestionCard.tsx
  ChoiceQuestion.tsx
  FillQuestion.tsx
  CalcQuestion.tsx
  DiagnosticReport.tsx
  WeakOpportunityList.tsx
  RiskReportCard.tsx

src/components/dashboard/
  ScoreGapCard.tsx
  PassProbabilityCard.tsx
  TodayPredictionCard.tsx
  RiskWarningsCard.tsx
  TopOpportunitiesCard.tsx
```

### 修改文件
```
src/app/(app)/projects/[projectId]/overview/page.tsx  # 重构为驾驶舱 v1
src/app/(app)/layout.tsx                                # 导航重命名
```

## 8. 验收标准

| 场景 | 预期结果 |
|------|----------|
| 用户点击「开始诊断」 | 生成10~20道题，覆盖主要考点 |
| 用户完成诊断提交 | 显示估分区间 + Top3薄弱机会 + 达标概率 |
| 用户点击「生成路线」 | 生成 SprintPlan + 每日 StudyTask |
| 用户查看今日任务 | 按优先级排列，每条显示耗时+提分+原因 |
| 用户打开驾驶舱 | 4卡片 + Top3 + 风险提示 + 今日任务入口 |
| 用户修改目标分60→75 | 路线重新生成，任务更新 |
| 诊断数据为空 | 各页面显示对应空状态引导 |

> **执行顺序**：API → Service → Page → Component
> **先跑通 S2-1 诊断闭环，再串联 S2-2/S2-3 路线和任务，最后组装 S2-4 驾驶舱**
