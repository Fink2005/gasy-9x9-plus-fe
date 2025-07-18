import arcjet, { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/numerology') || pathname === '/' || pathname.startsWith('/ranking');
};

const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith('/login')
    || pathname.startsWith('/verify-email')
    || pathname.startsWith('/verified')
    || pathname.startsWith('/kyc');
};

const isWelcomePage = (pathname: string): boolean => {
  return pathname.startsWith('/welcome')
    || pathname.startsWith('/introduction')
    || pathname.startsWith('/policy-terms');
};

// Arcjet security setup
const aj = arcjet({
  key: process.env.NEXT_PUBLIC_ARCJET_KEY!, // Make sure this is defined in Vercel
  rules: [
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:PREVIEW',
        'CATEGORY:MONITOR',
      ],
    }),
  ],
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Set custom header with pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Safely parse authData cookie
  let isAuthenticated: boolean | undefined;
  const authDataCookie = request.cookies.get('authData');

  if (authDataCookie) {
    try {
      const parsed = JSON.parse(authDataCookie.value);
      isAuthenticated = parsed?.isKyc;
    } catch (error) {
      console.error('❌ Failed to parse authData cookie in middleware:', error);
    }
  }

  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Skip middleware for specific paths
  if (pathname.startsWith('/request')) {
    return NextResponse.next();
  }

  // Arcjet protection
  if (process.env.NEXT_PUBLIC_ARCJET_KEY) {
    try {
      const decision = await aj.protect(request);
      if (decision.isDenied()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (error) {
      console.error('❌ Arcjet error:', error);
      return NextResponse.json({ error: 'Internal Error (Arcjet)' }, { status: 500 });
    }
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login/welcome pages
  if ((isAuthPage(pathname) && isAuthenticated) || (isWelcomePage(pathname) && isAuthenticated)) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Apply i18n routing
  return handleI18nRouting(requestWithHeaders);
}

// Middleware matcher
export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
