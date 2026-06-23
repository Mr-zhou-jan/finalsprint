import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const ct = req.headers.get("content-type") || ""

  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData()
    const file = fd.get("file") as File | null; const title = fd.get("title") as string
    const projectId = fd.get("projectId") as string; const type = fd.get("type") as string
    if (!file || !title || !projectId) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
    const { data: m } = await supabase.from("Material").insert({ projectId, title, resourceType: type, storagePath: file.name, parseStatus: "pending" }).select("id").single()
    return NextResponse.json({ id: m?.id })
  }

  const { projectId, title, rawText, type } = await req.json()
  if (!projectId || !title || !rawText) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  const { data: m } = await supabase.from("Material").insert({ projectId, title, resourceType: type || "text", rawText, parseStatus: "pending" }).select("id").single()
  return NextResponse.json({ id: m?.id })
}
