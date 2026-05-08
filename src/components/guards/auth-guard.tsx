/**
 * Enhanced Auth Guard
 * Handles authentication validation, redirects, and loading states
 */

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { tokenManager } from '@/lib/token-manager';
import { PageSkeleton } from '@/components/feedback/loading-skeleton';
import { checkSessionTimeout } from '@/store/auth-store';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  requireOnboarding?: boolean;
}

export function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles,
  requireOnboarding = true,
}: AuthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  const {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    hasAnyRole,
  } = useAuthStore();

  useEffect(() => {
    // Wait for initialization
    if (!isInitialized || isLoading) return;

    const checkAuth = async () => {
      // Check session timeout
      if (isAuthenticated && checkSessionTimeout()) {
        router.push('/auth/session-expired?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // Require authentication
      if (requireAuth && !isAuthenticated) {
        const callbackUrl = searchParams.get('callbackUrl') || window.location.pathname;
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      // Redirect authenticated users away from auth pages
      if (!requireAuth && isAuthenticated) {
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push('/dashboard');
        }
        return;
      }

      // Check role permissions
      if (requireAuth && allowedRoles && allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
          router.push('/unauthorized');
          return;
        }
      }

      // Check onboarding status
      if (requireAuth && requireOnboarding && user && !user.onboardingCompleted) {
        router.push('/onboarding');
        return;
      }

      // Check location assignment
      if (requireAuth && user?.role !== 'platform_admin') {
        if (!user?.restaurantIds?.length) {
          router.push('/no-location-assigned');
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [
    isAuthenticated,
    isInitialized,
    isLoading,
    requireAuth,
    allowedRoles,
    requireOnboarding,
    user,
    hasAnyRole,
    router,
    searchParams,
  ]);

  if (!isInitialized || isLoading || isChecking) {
    return <PageSkeleton />;
  }

  // Show content if all checks pass
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// Role-specific guards
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth allowedRoles={['platform_admin']}>
      {children}
    </AuthGuard>
  );
}

export function OwnerGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth allowedRoles={['restaurant_owner', 'platform_admin']}>
      {children}
    </AuthGuard>
  );
}

export function ManagerGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard
      requireAuth
      allowedRoles={['manager', 'restaurant_owner', 'platform_admin']}
    >
      {children}
    </AuthGuard>
  );
}

export function StaffGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard
      requireAuth
      allowedRoles={['manager', 'restaurant_owner', 'chef', 'cashier', 'waiter']}
    >
      {children}
    </AuthGuard>
  );
}

// Public guard (redirects authenticated users)
export function PublicGuard({ children }: { children: ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}
