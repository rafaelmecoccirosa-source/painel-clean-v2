import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const ROLE_REDIRECT: Record<string, string> = {
  cliente: "/cliente",
  tecnico: "/tecnico",
  admin:   "/admin",
};

/**
 * Server-side role redirect after login.
 * Called by the login page after signInWithPassword succeeds.
 * Reads the session from cookies, fetches the role via service client
 * (bypasses RLS — always works), then returns a 302 to the correct dashboard.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    const serviceClient = createServiceClient();
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const destination = ROLE_REDIRECT[profile?.role ?? "cliente"] ?? "/cliente";
    return NextResponse.redirect(`${origin}${destination}`);
  } catch {
    return NextResponse.redirect(`${origin}/login`);
  }
}
