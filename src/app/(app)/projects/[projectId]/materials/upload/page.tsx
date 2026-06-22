"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, FileText, ClipboardPaste } from "lucide-react"

export default function MaterialUploadPage() {
  const { projectId } = useParams() as { projectId: string }
  const router = useRouter()
  const [tab, setTab] = useState("pdf")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState("")
  const [textType, setTextType] = useState("text")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePdfUpload = async () => {
    if (!file || !title) { setError("请填写标题并选择文件"); return }
    setLoading(true); setError("")
    const formData = new FormData()
    formData.append("file", file); formData.append("title", title)
    formData.append("projectId", projectId); formData.append("type", "pdf")
    try {
      const res = await fetch("/api/materials/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      router.push(`/projects/${projectId}/materials/${data.id}/review`)
    } catch { setError("上传失败"); setLoading(false) }
  }

  const handleTextUpload = async () => {
    if (!title || !textContent) { setError("请填写标题和内容"); return }
    setLoading(true); setError("")
    const res = await fetch("/api/materials/upload", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, title, rawText: textContent, type: textType }),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    router.push(`/projects/${projectId}/materials/${data.id}/review`)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href={`/projects/${projectId}/overview`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 mb-6"><ArrowLeft className="w-4 h-4" />返回</Link>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" />上传资料</CardTitle><CardDescription>上传教材、复习资料、往年题或老师重点</CardDescription></CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full mb-4"><TabsTrigger value="pdf" className="flex-1 gap-1"><FileText className="w-4 h-4" />PDF 文件</TabsTrigger><TabsTrigger value="text" className="flex-1 gap-1"><ClipboardPaste className="w-4 h-4" />文本粘贴</TabsTrigger></TabsList>
            <TabsContent value="pdf" className="space-y-4">
              <div><Label>资料标题</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="如：高数期末复习资料" /></div>
              <div><Label>选择 PDF 文件</Label><Input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} /></div>
              <Button onClick={handlePdfUpload} className="w-full" disabled={loading}>{loading ? "上传中…" : "上传并解析 →"}</Button>
            </TabsContent>
            <TabsContent value="text" className="space-y-4">
              <div><Label>资料标题</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="如：老师划的重点" /></div>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: "text", l: "复习资料" as const }, { v: "past_exam", l: "往年题" as const }, { v: "text", l: "老师重点" as const }].map(o => <Button key={o.l} type="button" variant={textType === o.v ? "default" : "outline"} size="sm" onClick={() => setTextType(o.v)}>{o.l}</Button>)}
              </div>
              <div><Label>文本内容</Label><Textarea value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="粘贴资料内容…" rows={12} /></div>
              <Button onClick={handleTextUpload} className="w-full" disabled={loading}>{loading ? "保存中…" : "保存并解析 →"}</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
