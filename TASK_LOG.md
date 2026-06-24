# FinalSprint 任务日志

> **用途**：新 Agent 读取此文件即可了解项目全貌、当前进度、下一步做什么。
> **更新规则**：每次修改后在本文件顶部追加新条目。

## 快速概览

| 项目 | 值 |
|------|-----|
| 产品 | FinalSprint — AI 期末提分系统 |
| 技术栈 | Next.js 16 + TypeScript + Tailwind + shadcn/ui + Supabase + Netlify |
| 代码位置 | `D:\claude code产品\finalsprint` |
| 线上地址 | https://luminous-souffle-17fa31.netlify.app |
| GitHub | https://github.com/Mr-zhou-jan/finalsprint |
| Supabase | fknmjahvtcxvljepbyue |

## 项目架构

**16 张表**：User → Project → ExamScope / ExamPoint / Material / DiagnosticRun / SprintPlan → StudyTask[] / PracticeQuestion → QuestionAttempt → WrongQuestion / AiTask

**22 个 API**（全部 Supabase HTTP，不是 Prisma）：projects CRUD(3) + materials(1) + dashboard(1) + diagnostic(2) + plan(3) + practice(2) + errors(2) + exam(2) + 其他(6)

**14 个页面**：Landing / Login / Register / 项目列表 / 新建项目 / 战情室 / 资料上传 / 诊断作答 / 诊断报告 / 冲刺任务 / 考点冲刺卡 / 专项刷题 / 错题回炉 / 模拟考场

## 环境变量（.env + Netlify 后台）
Supabase URL: fknmjahvtcxvljepbyue.supabase.co
DB URL: port 6543 (PgBouncer pooler, 适合 serverless)
DeepSeek API Key: sk-6d143...

---

## 改动记录

### 2026-06-24 #1: 任务重整 — 把所有待办/未完成/做事逻辑写入 TASK_LOG

**目的**：多次 compaction 后任务碎片化，需要重新梳理全局状态。

**做了什么**：将 TASK_LOG.md 从碎片化状态重构为完整的项目追踪文件，包含：
- 完整待办清单（P0-P3 优先级）
- 做事逻辑（执行顺序 + 每步操作流程）
- 部署判断规则（什么时候需要重新部署 Netlify）

### 2026-06-23 #2: Prisma→Supabase HTTP 全量迁移

**目的**：解决创建项目"卡住"问题。Prisma 7 需要 pg adapter TCP 直连，Netlify serverless 不支持。

**改了什么**：22 个 API 路由全部从 `import { db } from "@/lib/db"` + `db.project.findMany(...)` 改为 `import { createServerSupabase } from "@/lib/supabase/server"` + `supabase.from("Project").select(...)`。

**如何改的**：
1. `src/lib/db.ts` → `export const db = {} as any`（空桩）
2. 逐个 API 路由重写：projects/route.ts, projects/[id]/route.ts, dashboard/route.ts, diagnostic/generate/route.ts, diagnostic/submit/route.ts, materials/upload/route.ts, plan/today/route.ts, plan/tasks/[taskId]/route.ts, plan/generate/route.ts, errors/route.ts, errors/[errorId]/route.ts, practice/generate/route.ts, practice/submit/route.ts, exam/generate/route.ts, exam/submit/route.ts
3. 7 个 features/*.service.ts → 清空为 `export {}`（桩）
4. `src/app/(app)/projects/new/page.tsx` → 加 error 状态 + try/catch

**为什么**：Netlify serverless 函数不支持 pg TCP 连接。Supabase HTTP (PostgREST) 走 HTTP，零连接问题。

### 2026-06-23 #1: RLS 权限修复 + Supabase Auth Redirect URL

**目的**：创建项目时报"uuid = text operator does not exist"→RLS 没开 + Auth 重定向 URL 不匹配。

**改了什么**：
1. Supabase SQL Editor 执行 16 条 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (auth.uid()::text = "userId")`
2. Supabase Auth 添加 redirect URL: `https://luminous-souffle-17fa31.netlify.app/**`

### 2026-06-22: Sprint 1~4 完整开发

详见设计文档：`docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/AI-ENGINE.md`, `docs/SPRINT-2.md`, `docs/FRONTEND.md`

---

## 当前状态

### ✅ 已完成
- 注册/登录（Supabase Auth）
- 项目 CRUD API（Supabase HTTP）
- 战情室页面（Overview）
- 诊断作答 + 报告页面
- 冲刺任务页面
- 冲刺卡页面
- 刷题页面
- 错题回炉页面
- 模拟考场页面
- 16 张数据库表 + RLS
- 设计文档 5 份
- Netlify 生产部署成功 (build 2.4s + deploy 36.9s, https://luminous-souffle-17fa31.netlify.app)
- 学科速通页（6 门学科：高等数学/大学物理/工程力学/C++/Python/互换性测量，用 Lucide 图标）
- Netlify 图片处理修复（--skip-images-convert，inline Lucide 图标替代 SVG 文件）

### ⚠️ 已验证（上次部署后）
- 创建项目后正确跳转到战情室
- 所有 API 在 Netlify 生产环境正常工作


---

## ❌ 待办清单（完整、排好优先级）

### P0 — 阻塞性（必须先修）

#### P0-1: 修复 practice/submit/route.ts 第 39 行 isCorrect 写死 false
- **文件**：`src/app/api/projects/[id]/practice/submit/route.ts`
- **问题**：results 数组中每条记录的 `isCorrect` 硬编码为 `false`，无论实际是否答对
- **影响**：练习提交后永远显示"全错"，刷题功能不可用
- **修复难度**：低（单行修复）

#### P0-2: 手动 E2E 验证关键流程（Agent 方案两次失败）
- **背景**：两次 Agent E2E 测试均因 "API Error: Connection closed mid-response" 失败，Agent 方案在当前环境不可靠
- **替代方案**：直接用 Playwright MCP 工具手动验证关键页面
- **验证清单**：
  1. 登录页 (`/login`) — 页面正常渲染，test@test.com/123456 可登录
  2. 项目列表 (`/projects`) — 能显示已有项目
  3. 创建项目 (`/projects/new`) — 创建后跳转战情室无报错
  4. 战情室 (`/projects/[id]/overview`) — 4 步引导卡正常显示
  5. 诊断测试 (`/projects/[id]/diagnostic/start`) — 能答题并获取报告
  6. 练习刷题 (`/projects/[id]/practice`) — 能选题作答
  7. 模拟考场 (`/projects/[id]/exam`) — 三阶段正常
  8. 每个页面检查 console 无红色 error


### P1 — 高优先级（功能完整）

#### P1-1: 接入 DeepSeek API — 诊断题生成
- **当前状态**：诊断题全部是模板占位符（preset-0 ~ preset-9），无 AI 生成
- **需要做**：
  1. `src/app/api/projects/[id]/diagnostic/generate/route.ts` → 调用 DeepSeek Chat API
  2. Prompt：根据 ExamPoint 列表 + 用户水平 → 生成 10 道诊断题（JSON 格式）
  3. 入库 `DiagnosticRun` + `DiagnosticQuestion[]`
  4. 前端答题需要从 DB 读取而非 preset

#### P1-2: 接入 DeepSeek API — 冲刺计划生成
- **当前状态**：计划生成 API 返回固定模板
- **需要做**：`plan/generate/route.ts` → DeepSeek 根据诊断结果 + 剩余天数 + 考点 ROI 生成个性化每日计划

#### P1-3: 接入 DeepSeek API — 题目生成
- **当前状态**：练习/考试题目全部是预设数据
- **需要做**：`practice/generate/route.ts` + `exam/generate/route.ts` → DeepSeek 根据考点 + 难度生成题目

#### P1-4: 接入 DeepSeek API — 批改评分
- **当前状态**：评分用 PRESET_ANSWERS 字典硬编码
- **需要做**：`practice/submit/route.ts` + `exam/submit/route.ts` → DeepSeek 批改主观题 + 生成解析


### P2 — 完善性（体验和覆盖）

#### P2-1: 补充其余 5 科速通数据
- **文件**：`src/app/(app)/speedrun/page.tsx` 或对应的学科数据文件
- **当前**：大学物理/工程力学/C++/Python/互换性测量只有占位内容
- **需要**：每门课补充章节结构、公式、例题

#### P2-2: 配置 GitHub Actions 自动部署
- **目的**：避免 Windows symlink 问题，push 即自动部署
- **需要**：`.github/workflows/deploy.yml` → 用 ubuntu-latest runner 构建 + `netlify deploy --prod`

#### P2-3: 完善估分算法
- **当前**：估分区间 [pct-10, pct+5] 基于试卷正确率简单估算
- **需要**：接入 PRD 4.7 的 masteryWeight 加权算法（unknown=0.1, weak=0.3, pass=0.65, good=0.9）

#### P2-4: 修复 Netlify 部署 EPERM 错误
- **当前**：Windows 下 netlify-cli deploy 因 symlink 报 EPERM，成功率 ~50%
- **根因**：Windows symlink 创建需要管理员权限或开发者模式
- **解决方向**：GitHub Actions（Linux 环境）自动部署，或启用 Windows 开发者模式


### P3 — 增强性（V2 功能）

- Supabase 启用匿名注册（当前仅 test@test.com 可用）
- 移动端响应式适配
- PDF 真文本提取 + AI 解析资料链路
- 错题自动归因（当前是用户自选）
- 知识图谱可视化


## 做事逻辑（执行顺序）

```
P0 修复（让现有功能跑通）
  → P1 DeepSeek 接入（让 AI 真正干活）
    → P2 完善（体验 + 覆盖）
      → P3 增强（V2）
```

**每步操作流程**：
1. 先读 TASK_LOG.md（本文件）
2. 读要改的文件（Read 工具）
3. 改代码（Edit/Write 工具）
4. 本地验证（`npx next build` 检查编译）
5. 如果是 P1 DeepSeek 相关：用 curl 测试 API 路由
6. 在本文件顶部追加改动记录
7. 如需部署到 Netlify：`npx netlify deploy --prod --dir=.next`

**不需要重新部署 Netlify 的情况**：
- 只改了 API 路由逻辑（通过 curl 验证即可）
- 只改了服务端代码

**需要重新部署 Netlify 的情况**：
- 改了前端页面（用户可见的 UI）
- 改了客户端组件

## 外部链接

| 名称 | URL |
|------|-----|
| Supabase | https://supabase.com/dashboard/project/fknmjahvtcxvljepbyue |
| Supabase SQL | https://supabase.com/dashboard/project/fknmjahvtcxvljepbyue/sql/new |
| Netlify | https://app.netlify.com/projects/luminous-souffle-17fa31 |
| 网站 | https://luminous-souffle-17fa31.netlify.app |
| GitHub | https://github.com/Mr-zhou-jan/finalsprint |
