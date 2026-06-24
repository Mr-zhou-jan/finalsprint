// ========== AI对话 ==========
export interface ChatMessage {
  role: "system" | "user" | "assistant"; content: string;
}

export interface ChatOptions {
  model?: string; temperature?: number;
  maxTokens?: number; socraticMode?: boolean;
}

export type { SprintPlanOutput } from "./ai";
export type { SprintPlanOutput as AlgSprintPlanOutput } from "./algorithms";