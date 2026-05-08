/**
 * Permission Guard Components
 * Conditional rendering based on permissions and roles
 */

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useLocation } from '@/providers/location-provider';

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  locationId?: string;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  locationId,
  fallback = null,
}: PermissionGuardProps) {
  const hasPermission = useAuthStore((state) =>
    state.hasPermission(permission, locationId)
  );

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

interface PermissionsGuardProps {
  children: ReactNode;
  permissions: string[];
  requireAll?: boolean;
  locationId?: string;
  fallback?: ReactNode;
}

export function PermissionsGuard({
  children,
  permissions,
  requireAll = false,
  locationId,
  fallback = null,
}: PermissionsGuardProps) {
  const checkPermission = useAuthStore((state) => state.hasPermission);

  const results = permissions.map((perm) => checkPermission(perm, locationId));
  const hasPermission = requireAll
    ? results.every(Boolean)
    : results.some(Boolean);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

interface RoleGuardProps {
  children: ReactNode;
  role: string;
  fallback?: ReactNode;
}

export function RoleGuard({ children, role, fallback = null }: RoleGuardProps) {
  const hasRole = useAuthStore((state) => state.hasRole(role));
  return hasRole ? <>{children}</> : <>{fallback}</>;
}

interface AnyRoleGuardProps {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}

export function AnyRoleGuard({
  children,
  roles,
  fallback = null,
}: AnyRoleGuardProps) {
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole(roles));
  return hasAnyRole ? <>{children}</> : <>{fallback}</>;
}

interface LocationGuardProps {
  children: ReactNode;
  locationId?: string;
  fallback?: ReactNode;
}

export function LocationGuard({
  children,
  locationId,
  fallback = null,
}: LocationGuardProps) {
  const { hasLocationAccess } = useLocation();
  const targetLocation = locationId || useAuthStore.getState().user?.currentLocationId;
  
  const hasAccess = targetLocation ? hasLocationAccess(targetLocation) : false;
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Conditional wrapper that disables UI instead of hiding
interface DisableOnPermissionProps {
  children: React.ReactElement;
  permission: string;
  locationId?: string;
}

export function DisableOnNoPermission({
  children,
  permission,
  locationId,
}: DisableOnPermissionProps) {
  const hasPermission = useAuthStore((state) =>
    state.hasPermission(permission, locationId)
  );

  return (
    <div className={!hasPermission ? 'pointer-events-none opacity-50' : ''}>
      {children}
    </div>
  );
}
