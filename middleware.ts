import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes — always allow
  const publicRoutes = ["/", "/login", "/cadastro"];
  if (publicRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  // Unauthenticated — redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based protection: fetch role from profiles
  const isAdminRoute  = pathname.startsWith("/admin");
  const isClienteRoute = pathname.startsWith("/cliente");
  const isTecnicoRoute = pathname.startsWith("/tecnico");

  if (isAdminRoute || isClienteRoute || isTecnicoRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const role = profile?.role ?? "cliente";

    const correctRoot: Record<string, string> = {
      admin:   "/admin",
      tecnico: "/tecnico",
      cliente: "/cliente",
    };

    const expectedPrefix = correctRoot[role] ?? "/cliente";
    const currentPrefix  = isAdminRoute ? "/admin" : isClienteRoute ? "/cliente" : "/tecnico";

    if (currentPrefix !== expectedPrefix) {
      const url = request.nextUrl.clone();
      url.pathname = expectedPrefix;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
