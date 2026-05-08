export const APP_NAME = 'RestaurantOS';
export const DEFAULT_PAGE_SIZE = 20;
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const CURRENCY = 'USD';
export const LOCALE = 'en-US';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CASHIER: 'cashier',
  CHEF: 'chef',
} as const;

export const PERMISSIONS = {
  MANAGE_RESTAURANTS: 'manage:restaurants',
  MANAGE_ORDERS: 'manage:orders',
  MANAGE_MENU: 'manage:menu',
  MANAGE_STAFF: 'manage:staff',
  VIEW_REPORTS: 'view:reports',
  MANAGE_SETTINGS: 'manage:settings',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const RESTAURANT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
} as const;
