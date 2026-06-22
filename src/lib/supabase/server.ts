import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (entries) => {
          for (const { name, value, options } of entries) {
            cookieStore.set(name, value, options)
          }
        },
      },
    }
  )
}
