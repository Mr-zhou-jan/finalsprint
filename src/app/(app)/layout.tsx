"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PlusCircle, LogOut, Zap, BookOpen, GraduationCap, Cpu, Hammer, Ruler, TrendingUp, ChevronDown, Languages } from "lucide-react"
import { cn } from "@/lib/utils"

const SUBJECTS = [
  { id: "大学英语", icon: Languages, color: "from-red-500 to-pink-500" },
  { id: "高等数学", icon: GraduationCap, color: "from-orange-500 to-red-500" },
  { id: "大学物理", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
  { id: "工程力学", icon: Hammer, color: "from-yellow-500 to-orange-500" },
  { id: "C++程序设计", icon: Cpu, color: "from-blue-600 to-indigo-600" },
  { id: "Python", icon: Cpu, color: "from-green-500 to-emerald-500" },
  { id: "互换性测量", icon: Ruler, color: "from-purple-500 to-pink-500" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subjectsOpen, setSubjectsOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return }
      setUser(user); setLoading(false)
    })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login") }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <div className="flex h-screen bg-zinc-50">
      <aside className="w-56 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <Link href="/projects" className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
          <span className="font-bold text-lg">LearnOS</span>
        </Link>
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <Link href="/projects" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", pathname === "/projects" ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-100")}><LayoutDashboard className="w-5 h-5" />冲刺项目</Link>
          <Link href="/subjects" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/subjects") ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-100")}><BookOpen className="w-5 h-5" />学科速通</Link>
        </nav>
        <div className="border-t p-3">
          <div className="flex items-center gap-3 px-2 py-1 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">{user?.user_metadata?.name?.[0] || user?.email?.[0] || "U"}</div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{user?.user_metadata?.name || "用户"}</p><p className="text-xs text-zinc-400 truncate">{user?.email}</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"><LogOut className="w-4 h-4" />退出</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
