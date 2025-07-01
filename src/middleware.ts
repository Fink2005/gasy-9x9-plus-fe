import arcjet, { detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import type { NextFetchEvent } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/'
]);

const isAuthPage = createRouteMatcher([
  '/login(.*)',
  '/sign-up(.*)',
]);

const isWelcomePage = createRouteMatcher([
  '/welcome(.*)',
  '/introduction(.*)',
  '/policy-terms(.*)',
]);

// Improve security with Arcjet
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Use environment variable directly
  rules: [
    detectBot({
      mode: 'LIVE',
      // Block all bots except the following
      allow: [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        'CATEGORY:SEARCH_ENGINE', // Allow search engines
        'CATEGORY:PREVIEW', // Allow preview links to show OG images
        'CATEGORY:MONITOR', // Allow uptime monitoring services
      ],
    }),
  ],
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // to recoginize the pathname in the headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  const isAuthenticated = request.cookies.has('walletAddress');

  // Create a new request with custom headers
  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  if (isAuthPage(request) || isProtectedRoute(request)) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req) && !isAuthenticated) {
        const signInUrl = new URL(`/login`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      if ((isAuthPage(req) || isWelcomePage(req)) && isAuthenticated) {
        const root = new URL(`/`, req.url);
        return NextResponse.redirect(root);
      }

      return handleI18nRouting(requestWithHeaders);
    })(request, event);
  }

  // For non-auth routes, still need i18n routing
  return handleI18nRouting(requestWithHeaders);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
