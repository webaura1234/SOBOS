import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/order',
  '/onboarding',
  '/invitation',
  '/unauthorized',
  '/session-expired',
  '/no-access',
  '/no-location-assigned',
  '/offline',
];

// Auth routes (redirect authenticated users away)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

// Check if route is auth route
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without any checks
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For static/demo deployments: Auth is handled client-side via localStorage
  // Middleware only handles basic security headers and route normalization
  // Client-side AuthGuard components handle actual authentication

  // Check for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For demo/static deployment: Allow all dashboard routes
  // Client-side auth guards will handle redirects if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
