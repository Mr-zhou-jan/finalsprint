"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerWithEmail, isValidEmail, isValidPassword } from "@/lib/user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    const emailErr = isValidEmail(email)
    if (emailErr) { setError(emailErr); setLoading(false); return }
    const pwCheck = isValidPassword(password)
    if (!pwCheck.valid) { setError(pwCheck.reason); setLoading(false); return }
    if (!name.trim()) { setError("请输入昵称"); setLoading(false); return }
    try {
      await registerWithEmail(email, name, password)
      router.push("/projects"); router.refresh()
    } catch (err: any) {
      setError(err.message || "注册失败，请重试")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3"><Zap className="w-6 h-6 text-white" /></div>
          <CardTitle className="text-2xl">注册 LearnOS</CardTitle>
          <CardDescription>开始你的期末冲刺</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div><Label>昵称</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="你的昵称" /></div>
            <div><Label>邮箱</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
            <div><Label>密码</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="至少6位" required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "注册中…" : "注册"}</Button>
          </form>
          <p className="text-sm text-zinc-500 text-center mt-4">已有账号？<Link href="/login" className="text-orange-600 font-semibold hover:underline">登录</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}
