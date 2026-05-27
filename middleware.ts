import { auth } from './auth';
import { updateSession } from '@/lib/supabase/middleware';

export default auth(async (request) => {
  return updateSession(request);
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
