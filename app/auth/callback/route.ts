import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_REDIRECT: Record<string, string> = {
  cliente: "/cliente",
  tecnico: "/tecnico",
  admin: "/admin",
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  if (!profile) {
    // New Google user — send to complete profile
    return NextResponse.redirect(`${origin}/completar-cadastro`);
  }

  const destination = ROLE_REDIRECT[profile.role] ?? "/cliente";
  return NextResponse.redirect(`${origin}${destination}`);
}
