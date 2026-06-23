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

### ⚠️ 待验证
- 创建项目后正确跳转到战情室（上次部署未完成，可能用户看到旧版）
- 所有 API 在 Netlify 生产环境正常工作

### ❌ 已知问题
1. **Netlify 部署不稳定**：Windows symlink EPERM 错误，成功率约 50%。需重试或用管理员终端。
2. **无真实 AI 内容**：诊断题/冲刺卡是模板占位符，需接入 DeepSeek API。

### 下一步
1. 部署最新代码：管理员终端 `cd D:\claude code产品\finalsprint && npx netlify-cli deploy --prod`
2. 验证注册→创建项目→战情室→诊断全流程
3. 接入 DeepSeek 生成真实内容
4. 用 GitHub Actions 自动部署（Linux 环境，避免 Windows symlink 问题）

---

## 外部链接

| 名称 | URL |
|------|-----|
| Supabase | https://supabase.com/dashboard/project/fknmjahvtcxvljepbyue |
| Supabase SQL | https://supabase.com/dashboard/project/fknmjahvtcxvljepbyue/sql/new |
| Netlify | https://app.netlify.com/projects/luminous-souffle-17fa31 |
| 网站 | https://luminous-souffle-17fa31.netlify.app |
| GitHub | https://github.com/Mr-zhou-jan/finalsprint |
