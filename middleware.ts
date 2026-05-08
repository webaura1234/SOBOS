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
];

// Auth routes (redirect authenticated users away)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Routes that require specific roles
const roleProtectedRoutes: Record<string, string[]> = {
  '/admin': ['platform_admin'],
};

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

// Check if route is auth route
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}

// Get required roles for route
function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(roleProtectedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && isAuthenticated) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles) {
    // In production, you'd decode the JWT and check the role
    // For now, we let the client-side guards handle this
    return NextResponse.next();
  }

  // Check for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
