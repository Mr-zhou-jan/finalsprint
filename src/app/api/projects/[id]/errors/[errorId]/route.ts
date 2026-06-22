import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { resolveError } from "@/features/errors/error-book.service"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; errorId: string }> }) {
  const supabase = await createServerSupabase(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 })
  const { errorId } = await params
  try { return NextResponse.json(await resolveError(errorId)) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
