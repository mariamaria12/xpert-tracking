import { updateSession } from "@/lib/supabase/middleware";

export default async function proxy(request: Parameters<typeof updateSession>[0]) {
  const { response, user } = await updateSession(request);
  const isLoggedIn = !!user;

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/login";
  const isPublicAsset =
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  // If user is not logged in, force them to login for any route.
  if (!isLoggedIn && !isLoginPage && !isPublicAsset) {
    return Response.redirect(new URL("/login", request.nextUrl));
  }

  // If user is logged in, keep them out of the login page.
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/dashboard", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

