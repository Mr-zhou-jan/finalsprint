"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PlusCircle, Settings, LogOut, Zap, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return }
      setUser(user); setLoading(false)
    })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login") }

  return (
    <div className="flex h-screen bg-zinc-50">
      <aside className="w-56 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <Link href="/projects" className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
          <span className="font-bold text-lg">FinalSprint</span>
        </Link>
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <Link href="/projects" className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", pathname.startsWith("/projects") ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-100")}><LayoutDashboard className="w-5 h-5" />项目列表</Link>
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
