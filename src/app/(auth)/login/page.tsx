"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message === "Invalid login credentials" ? "邮箱或密码错误" : err.message); setLoading(false); return }
    router.push("/projects"); router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3"><Zap className="w-6 h-6 text-white" /></div>
          <CardTitle className="text-2xl">登录 LearnOS</CardTitle>
          <CardDescription>AI 驱动的期末冲刺系统</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div><Label>邮箱</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
            <div><Label>密码</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "登录中…" : "登录"}</Button>
          </form>
          <p className="text-sm text-zinc-500 text-center mt-4">还没有账号？<Link href="/register" className="text-orange-600 font-semibold hover:underline">注册</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
