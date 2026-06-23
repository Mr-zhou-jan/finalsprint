import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  const { data: errors } = await supabase.from("WrongQuestion").select("*, question:PracticeQuestion(*)").eq("projectId", id).eq("userId", user.id).order("createdAt", { ascending: false })
  const list = errors || []
  return NextResponse.json({ totalErrors: list.length, unresolvedErrors: list.filter((e:any)=>e.status==="active").length, groupedByPoint: [] })
}
