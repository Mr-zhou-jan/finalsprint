# 项目进度 — LearnOS 学科系统重构

## 任务逻辑
将旧共享模板学科页面替换为独立7模块工作台。每学科独立 mock 数据 + 动态路由渲染，模块含任务/资料/考纲/讲义/刷题/冲刺/回炉。

## 执行完成事项
- [x] 删除旧 `src/app/subjects/` 共享模板
- [x] 删除旧 `src/data/subjects/` 数据目录
- [x] 创建统一类型定义 (subject-types.ts)
- [x] 创建5学科配置 (subjects-config.ts)
- [x] 创建5学科 mock 数据 (math/physics/mechanics/tolerance/cpp)
- [x] 创建统一导出 (index.ts)
- [x] 完善 subject-components.tsx（SubjectShell + 7面板组件含 MaterialsPanel/ReviewCenterPanel）
- [x] 创建学科总站首页 (subjects/page.tsx)
- [x] 创建动态路由 [subject]/page.tsx + [subject]/[module]/page.tsx
- [x] TypeScript 类型检查零错误通过
- [x] 清理冗余文件 subject-shell.tsx

## 将要执行事项
- [ ] 启动 dev server 验证前端渲染
