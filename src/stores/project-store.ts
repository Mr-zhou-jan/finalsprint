"use client"
import { create } from "zustand"

interface ProjectStore {
  currentProjectId: string | null
  setCurrentProject: (id: string) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProjectId: typeof window !== "undefined" ? localStorage.getItem("fs_current_project") : null,
  setCurrentProject: (id) => { localStorage.setItem("fs_current_project", id); set({ currentProjectId: id }) },
  clearProject: () => { localStorage.removeItem("fs_current_project"); set({ currentProjectId: null }) },
}))
