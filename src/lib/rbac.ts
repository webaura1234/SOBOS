/**
 * RBAC Permission System
 * Dynamic role-based access control with location scoping
 */

import { User } from '@/types';

// Permission definitions
export const PERMISSIONS = {
  // Platform Admin
  PLATFORM_ADMIN: 'platform:admin',
  MANAGE_TENANTS: 'platform:manage_tenants',
  VIEW_ANALYTICS: 'platform:view_analytics',
  
  // Restaurant Management
  MANAGE_RESTAURANT: 'restaurant:manage',
  VIEW_RESTAURANT: 'restaurant:view',
  DELETE_RESTAURANT: 'restaurant:delete',
  
  // Menu
  MANAGE_MENU: 'menu:manage',
  VIEW_MENU: 'menu:view',
  UPDATE_PRICING: 'menu:update_pricing',
  
  // Orders
  MANAGE_ORDERS: 'orders:manage',
  VIEW_ORDERS: 'orders:view',
  PROCESS_ORDERS: 'orders:process',
  CANCEL_ORDERS: 'orders:cancel',
  
  // Staff
  MANAGE_STAFF: 'staff:manage',
  VIEW_STAFF: 'staff:view',
  ASSIGN_ROLES: 'staff:assign_roles',
  
  // Inventory
  MANAGE_INVENTORY: 'inventory:manage',
  VIEW_INVENTORY: 'inventory:view',
  UPDATE_STOCK: 'inventory:update_stock',
  
  // Reports
  VIEW_REPORTS: 'reports:view',
  EXPORT_REPORTS: 'reports:export',
  VIEW_FINANCIALS: 'reports:view_financials',
  
  // Kitchen
  VIEW_KITCHEN: 'kitchen:view',
  UPDATE_ORDER_STATUS: 'kitchen:update_status',
  
  // Tables
  MANAGE_TABLES: 'tables:manage',
  VIEW_TABLES: 'tables:view',
  
  // Settings
  MANAGE_SETTINGS: 'settings:manage',
  VIEW_SETTINGS: 'settings:view',
  
  // Customer
  PLACE_ORDERS: 'customer:place_orders',
  VIEW_ORDER_HISTORY: 'customer:view_history',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role definitions with default permissions
export const ROLES = {
  PLATFORM_ADMIN: {
    id: 'platform_admin',
    name: 'Platform Admin',
    permissions: Object.values(PERMISSIONS),
  },
  RESTAURANT_OWNER: {
    id: 'restaurant_owner',
    name: 'Restaurant Owner',
    permissions: [
      PERMISSIONS.MANAGE_RESTAURANT,
      PERMISSIONS.VIEW_RESTAURANT,
      PERMISSIONS.MANAGE_MENU,
      PERMISSIONS.VIEW_MENU,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.MANAGE_STAFF,
      PERMISSIONS.VIEW_STAFF,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.VIEW_KITCHEN,
      PERMISSIONS.UPDATE_ORDER_STATUS,
      PERMISSIONS.MANAGE_TABLES,
      PERMISSIONS.VIEW_TABLES,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_SETTINGS,
    ],
  },
  MANAGER: {
    id: 'manager',
    name: 'Manager',
    permissions: [
      PERMISSIONS.VIEW_RESTAURANT,
      PERMISSIONS.MANAGE_MENU,
      PERMISSIONS.VIEW_MENU,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
      PERMISSIONS.CANCEL_ORDERS,
      PERMISSIONS.VIEW_STAFF,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.UPDATE_STOCK,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_KITCHEN,
      PERMISSIONS.UPDATE_ORDER_STATUS,
      PERMISSIONS.MANAGE_TABLES,
      PERMISSIONS.VIEW_TABLES,
      PERMISSIONS.VIEW_SETTINGS,
    ],
  },
  CHEF: {
    id: 'chef',
    name: 'Chef',
    permissions: [
      PERMISSIONS.VIEW_MENU,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_KITCHEN,
      PERMISSIONS.UPDATE_ORDER_STATUS,
      PERMISSIONS.VIEW_INVENTORY,
    ],
  },
  CASHIER: {
    id: 'cashier',
    name: 'Cashier',
    permissions: [
      PERMISSIONS.VIEW_MENU,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
      PERMISSIONS.VIEW_TABLES,
    ],
  },
  WAITER: {
    id: 'waiter',
    name: 'Waiter',
    permissions: [
      PERMISSIONS.VIEW_MENU,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_TABLES,
    ],
  },
  CUSTOMER: {
    id: 'customer',
    name: 'Customer',
    permissions: [
      PERMISSIONS.PLACE_ORDERS,
      PERMISSIONS.VIEW_ORDER_HISTORY,
    ],
  },
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES]['id'];

// Location-scoped permission check
interface PermissionCheckOptions {
  user: User | null;
  permission: Permission;
  locationId?: string;
  requireAll?: boolean;
}

export function hasPermission({
  user,
  permission,
  locationId,
  requireAll = false,
}: PermissionCheckOptions): boolean {
  if (!user) return false;

  // Platform admin has all permissions
  if (user.role === ROLES.PLATFORM_ADMIN.id) return true;

  // Check if user has the permission
  const hasGlobalPermission = user.permissions?.includes(permission);

  if (!locationId) {
    return hasGlobalPermission ?? false;
  }

  // Check location-specific permissions
  const locationPermissions = user.locationPermissions?.[locationId];
  const hasLocationPermission = locationPermissions?.includes(permission);

  if (requireAll) {
    return (hasGlobalPermission && hasLocationPermission) ?? false;
  }

  return hasGlobalPermission || hasLocationPermission || false;
}

// Check multiple permissions
export function hasAnyPermission(
  user: User | null,
  permissions: Permission[],
  locationId?: string
): boolean {
  return permissions.some((permission) =>
    hasPermission({ user, permission, locationId })
  );
}

export function hasAllPermissions(
  user: User | null,
  permissions: Permission[],
  locationId?: string
): boolean {
  return permissions.every((permission) =>
    hasPermission({ user, permission, locationId })
  );
}

// Get role display name
export function getRoleDisplayName(roleId: string): string {
  const role = Object.values(ROLES).find((r) => r.id === roleId);
  return role?.name || roleId;
}

// Get role permissions
export function getRolePermissions(roleId: string): readonly Permission[] {
  const role = Object.values(ROLES).find((r) => r.id === roleId);
  return role?.permissions || [];
}
