# FinalSprint 后端架构设计

> 版本: v1.0 | 日期: 2026-06-22 | 状态: Sprint 2 完成, Sprint 3 进行中

## 1. 后端模块拆分

```
src/features/
├── projects/           # M1: 考试项目 CRUD
├── materials/          # M2: 资料上传+解析
├── score-engine/       # M3: 提分引擎(考点+ROI+路线)
├── diagnostic/         # M4: 诊断系统 ✅
├── sprint-plan/        # M5: 冲刺计划 ✅
├── sprint-card/        # M6: 考点冲刺卡 (S3)
├── practice/           # M7: 练习刷题 (S3)
├── errors/             # M8: 错题本 (S3)
└── ai/                 # AI服务层
    ├── provider-manager.ts
    ├── providers/ (deepseek/qwen/openai/claude)
    └── prompts/ (8 prompt files)
```

## 2. 完整 API 目录

### 项目 (Projects)
| Method | Path | 状态 |
|--------|------|------|
| GET | /api/projects | ✅ |
| POST | /api/projects | ✅ |
| GET | /api/projects/[id] | ✅ |

### 资料 (Materials)
| Method | Path | 状态 |
|--------|------|------|
| POST | /api/materials/upload | ✅ |

### 考点 (ExamPoints)
| Method | Path | 状态 |
|--------|------|------|
| GET | /api/projects/[id]/points/[pointId] | S3 |
| POST | /api/projects/[id]/points/[pointId]/build-card | S3 (异步) |

### 诊断 (Diagnostics)
| Method | Path | 状态 |
|--------|------|------|
| POST | /api/projects/[id]/diagnostic/generate | ✅ |
| POST | /api/projects/[id]/diagnostic/submit | ✅ |

### 冲刺计划 (Plans)
| Method | Path | 状态 |
|--------|------|------|
| POST | /api/projects/[id]/plan/generate | ✅ |
| GET | /api/projects/[id]/plan/today | ✅ |
| PATCH | /api/projects/[id]/plan/tasks/[taskId] | ✅ |

### 刷题 (Practice) — S3
| Method | Path | 状态 |
|--------|------|------|
| POST | /api/projects/[id]/practice/generate | S3 |
| POST | /api/projects/[id]/practice/submit | S3 |

### 错题 (Errors) — S3
| Method | Path | 状态 |
|--------|------|------|
| GET | /api/projects/[id]/errors | S3 |
| PATCH | /api/projects/[id]/errors/[errorId] | S3 |

### 驾驶舱
| Method | Path | 状态 |
|--------|------|------|
| GET | /api/projects/[id]/dashboard | ✅ |

## 3. AI 服务层

### 3.1 AIProvider 接口 (V1: DeepSeek only, V2: multi-provider)

```typescript
interface AIProvider {
  name: string
  generateText(input: { systemPrompt, userPrompt, temperature?, maxTokens? }): Promise<{ text, usage }>
  generateStructured<T>(input: { systemPrompt, userPrompt, schema: ZodSchema, temperature? }): Promise<T>
}
```

### 3.2 失败重试策略
- API超时 → 重试1次
- JSON解析失败 → 重试3次(每次降temperature 0.1)
- Zod校验失败 → 重试2次(追加格式提示)
- 全部失败 → 规则兜底 getFallback()

### 3.3 Prompt 文件规范
每个 prompt 导出: `SYSTEM_PROMPT` + `buildUserPrompt(input)` + `OutputSchema`

## 4. 异步任务设计

### 任务类型
material_parse | material_compress | exam_point_extract | diagnostic_generate | sprint_card_generate | practice_generate

### 状态流转
pending → running → success | failed → pending(retry) | failed(永久)

### V1 策略
- 快速任务(<5s): 同步API
- 慢任务: AiTask表 + 前端轮询(每2s, 最长60s)
- 幂等键: projectId+taskType+hash(input)

## 5. 安全与风控
- 文件 ≤20MB, 仅 .pdf/.txt/.md
- 每项目 ≤20份资料
- AI输出必须Zod校验
- AiTask幂等键防重复提交
- AI调用超时20s, 任务超时120s

## 6. 服务层职责边界
- **Route Handler**: 鉴权+参数+调service+返回 (薄)
- **Service**: 纯业务逻辑 (厚)
- **AI Provider**: API调用+JSON解析 (不耦合业务)
- **Prompt**: prompt文本+Zod schema (不做API调用)
