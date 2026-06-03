import { updateSession } from "@/lib/supabase/middleware";

export default async function proxy(request: Parameters<typeof updateSession>[0]) {
  const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!user;

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", request.nextUrl));
  }

  if (isLoggedIn && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
