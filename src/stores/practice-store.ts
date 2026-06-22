"use client"
import { create } from "zustand"

interface PracticeStore {
  sessionId: string | null; questions: any[]; answers: Record<string, string>; currentIdx: number; results: any[] | null
  setSession: (id: string, questions: any[]) => void
  setAnswer: (idx: number, value: string) => void
  setCurrentIdx: (idx: number) => void
  setResults: (results: any[]) => void
  reset: () => void
}

export const usePracticeStore = create<PracticeStore>((set) => ({
  sessionId: null, questions: [], answers: {}, currentIdx: 0, results: null,
  setSession: (id, questions) => set({ sessionId: id, questions, answers: {}, currentIdx: 0, results: null }),
  setAnswer: (idx, value) => set(s => ({ answers: { ...s.answers, [String(idx)]: value } })),
  setCurrentIdx: (idx) => set({ currentIdx: idx }),
  setResults: (results) => set({ results }),
  reset: () => set({ sessionId: null, questions: [], answers: {}, currentIdx: 0, results: null }),
}))
