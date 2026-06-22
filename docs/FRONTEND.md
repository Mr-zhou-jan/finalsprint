# FinalSprint 前端设计文档

> 版本: v1.0 | 日期: 2026-06-22

## 1. 路由结构

```
/                          Landing Page
/login /register           Auth
/projects                  科目列表
/projects/new              创建项目
/projects/[id]/overview    提分总控台 ★
/projects/[id]/materials   资料中心
/projects/[id]/analysis    考点分析(ROI+三档)
/projects/[id]/diagnostic/take    摸底诊断
/projects/[id]/diagnostic/report  诊断报告
/projects/[id]/plan        冲刺路线+今日任务
/projects/[id]/points/[pointId]   考点冲刺卡
/projects/[id]/practice    专项刷题
/projects/[id]/errors      错题回炉
/projects/[id]/exam        模拟考场 (S4)
```

## 2. 通用组件目录

```
src/components/
├── dashboard/   CountdownBar, ScoreGapCard, PassProbCard, StepGuide, TopOpportunities, RiskWarnings
├── diagnostic/  QuestionCard, ProgressBar, WeakOppList, RiskPanel
├── practice/    GradingFeedback
├── errors/      ErrorCard, ErrorStats
├── points/      FormulaCard, TrapCard
├── plan/        TaskCard, TaskGroup
└── shared/      EmptyState, LoadingSkeleton, ProjectCard
```

## 3. 状态管理

**Zustand**: project-store(currentProjectId), ui-store(sidebar), practice-store(answers)
**React Query**: useProject, useDashboard, useDiagnostic, usePlan, usePractice, useErrors
**异步轮询**: useTaskPolling(每2s, 最长60s)

## 4. 实现顺序

1. 提取通用组件 + Zustand stores + React Query hooks
2. 导航重命名(考试导向)
3. Overview 重构(用新组件组装)
4. 其他页面替换新组件
