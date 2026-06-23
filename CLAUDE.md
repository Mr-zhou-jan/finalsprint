# FinalSprint — Claude Code 项目指令

## 强制规则：每次修改前必须先读 TASK_LOG.md

每一步操作前，必须先执行：
```
Read D:\claude code产品\finalsprint\TASK_LOG.md
```

## 核心原则
1. 每次修改后更新 TASK_LOG.md（在顶部追加新条目）
2. 不要重新设计——先读 TASK_LOG.md 了解来龙去脉
3. 所有 API 用 Supabase HTTP（不是 Prisma 直连）
4. 不要在 git commit 中包含密钥
