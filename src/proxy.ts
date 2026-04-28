import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tiam.rainbow@gmail.com";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = request.nextUrl;
  const isAdminRoute = url.pathname.startsWith("/admin");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured — let pages render their own setup state.
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() refreshes the session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute) {
    if (!user) {
      const redirect = url.clone();
      redirect.pathname = "/login";
      redirect.searchParams.set("next", url.pathname);
      return NextResponse.redirect(redirect);
    }
    if (user.email !== ADMIN_EMAIL) {
      const redirect = url.clone();
      redirect.pathname = "/";
      redirect.searchParams.set("denied", "1");
      return NextResponse.redirect(redirect);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|.*\\..*).*)",
  ],
};
