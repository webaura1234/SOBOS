'use client';

import { useAuthStore } from '@/store/auth-store';
import { EmptyState } from '@/components/feedback';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, requiredRole, requiredPermission, fallback }: RoleGuardProps) {
  const { user, hasRole, hasPermission } = useAuthStore();

  if (!user) return null;

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <EmptyState
          icon="alert"
          title="Access Denied"
          description="You do not have the required role to access this page."
        />
      )
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      fallback || (
        <EmptyState
          icon="alert"
          title="Access Denied"
          description="You do not have the required permissions to access this page."
        />
      )
    );
  }

  return <>{children}</>;
}
