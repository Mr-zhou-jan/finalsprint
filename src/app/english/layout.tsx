"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Globe, FileText, BookOpen, Headphones, PenLine, Languages, Link2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const ENGLISH_NAV = [
  { href: "/english", label: "英语总览", icon: Globe },
  { href: "/english/exam", label: "整卷练习", icon: FileText },
  { href: "/english/reading", label: "阅读训练", icon: BookOpen },
  { href: "/english/listening", label: "听力训练", icon: Headphones },
  { href: "/english/writing", label: "作文批改", icon: PenLine },
  { href: "/english/translation", label: "翻译训练", icon: Languages },
  { href: "/english/matching", label: "段落匹配", icon: Link2 },
  { href: "/english/cloze", label: "选词填空", icon: FileText },
  { href: "/english/vocab", label: "词汇语法", icon: Zap },
]

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // 上传页全屏无侧边栏
  if (pathname === "/english/onboarding") return <>{children}</>
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="w-56 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <Link href="/subjects" className="flex items-center gap-2 px-4 py-4 border-b border-zinc-100 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />学科总站
        </Link>
        <div className="px-3 py-3">
          <h2 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">大学英语四六级</h2>
          <nav className="space-y-0.5">
            {ENGLISH_NAV.map(item => {
              const active = pathname === item.href || (item.href !== "/english" && pathname.startsWith(item.href + "/"))
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                )}>
                  <item.icon className={cn("w-4 h-4", active ? "text-indigo-500" : "text-zinc-400")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
