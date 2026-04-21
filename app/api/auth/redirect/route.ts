import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ROLE_REDIRECT: Record<string, string> = {
  cliente: "/cliente/home",
  tecnico: "/tecnico",
  admin:   "/admin",
};

/**
 * Server-side role redirect after login.
 * Reads the session + profile via the anon-key server client — RLS policy
 * `auth.uid() = user_id` lets the logged-in user read their own row, so no
 * service role is needed. Also falls back to user_metadata.role from the JWT
 * if the profiles row isn't there yet (fresh signup).
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  let role: string | null = null;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    role = profile?.role ?? null;
  } catch {
    /* fall through to JWT fallback */
  }

  if (!role) {
    const metaRole = (user.user_metadata?.role as string | undefined) ?? undefined;
    role = metaRole ?? "cliente";
  }

  const destination = ROLE_REDIRECT[role] ?? "/cliente/home";
  return NextResponse.redirect(`${origin}${destination}`);
}
