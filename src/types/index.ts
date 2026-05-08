import { PERMISSIONS } from '@/lib/rbac';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  permissions: string[];
  restaurantIds: string[];
  currentLocationId?: string;
  locationPermissions?: Record<string, string[]>;
  onboardingCompleted: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  status: string;
  cuisine?: string[];
  operatingHours?: OperatingHours;
  images?: string[];
  managerId?: string;
  ownerId?: string;
  settings?: RestaurantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  currency: string;
  timezone: string;
  taxRate: number;
  serviceCharge?: number;
  receiptFooter?: string;
}

export interface OperatingHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  customerId?: string;
  tableId?: string;
  items: OrderItem[];
  status: string;
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifications?: string[];
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime?: number;
  allergens?: string[];
  nutrition?: NutritionInfo;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Staff {
  id: string;
  userId: string;
  restaurantId: string;
  role: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_leave';
  permissions?: string[];
  joinedAt: string;
  invitedAt?: string;
  invitationAcceptedAt?: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  name?: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  section?: string;
  qrCode?: string;
  currentOrderId?: string;
  lastOccupiedAt?: string;
}

export interface InventoryItem {
  id: string;
  restaurantId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestockedAt?: string;
  expiryDate?: string;
}

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
