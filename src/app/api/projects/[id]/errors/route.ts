import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { getErrorBook } from "@/features/errors/error-book.service"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { id } = await params
  try { return NextResponse.json(await getErrorBook(id, user.id)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
