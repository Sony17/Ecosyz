import { NextRequest, NextResponse } from 'next/server';

// Name of the anonymous session cookie
const SESSION_COOKIE = 'anon_session';

// 180 days in seconds
const MAX_AGE = 60 * 60 * 24 * 180;

function isAsset(pathname: string) {
  // Skip static assets and Next internals
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public')
  );
}

function newSessionId() {
  // Use crypto.randomUUID when available
  // Fallback to a simple random string (very unlikely path in modern runtimes)
  try {
    // @ts-ignore
    return crypto.randomUUID();
  } catch {
    return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isAsset(pathname)) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const existing = req.cookies.get(SESSION_COOKIE)?.value;

  if (!existing) {
    const sid = newSessionId();
    res.cookies.set({
      name: SESSION_COOKIE,
      value: sid,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE,
    });
  }

  return res;
}

export const config = {
  // Run for all routes (except API auth paths in the future if needed)
  matcher: ['/((?!api/auth).*)'],
};
