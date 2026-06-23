import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; errorId: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { errorId } = await params
  await supabase.from("WrongQuestion").update({ status: "resolved", resolvedAt: new Date().toISOString() }).eq("id", errorId)
  return NextResponse.json({ success: true })
}
