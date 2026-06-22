import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const contentType = req.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string
    const projectId = formData.get("projectId") as string
    const type = formData.get("type") as string
    if (!file || !title || !projectId) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
    const material = await db.material.create({ data: { projectId, title, resourceType: type, storagePath: file.name, parseStatus: "pending" } })
    return NextResponse.json({ id: material.id })
  }

  const { projectId, title, rawText, type } = await req.json()
  if (!projectId || !title || !rawText) return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  const material = await db.material.create({ data: { projectId, title, resourceType: type || "text", rawText, parseStatus: "pending" } })
  return NextResponse.json({ id: material.id })
}
