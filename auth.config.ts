import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isOnDashboard = pathname.startsWith('/dashboard');
      const isAuthPage = pathname === '/login' || pathname === '/';

      // Return a redirect (not `false`) when custom middleware is chained:
      // NextAuth still runs the inner handler if `authorized` is false, which
      // would otherwise always call through to `NextResponse.next()`.
      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
