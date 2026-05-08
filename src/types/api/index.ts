import type { User, Restaurant, ApiResponse, PaginationMeta, QueryParams } from '@/types';

export type { ApiResponse };

export type LoginRequest = { 
  email: string; 
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = ApiResponse<{
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}>;

export type RegisterRequest = { 
  name: string; 
  email: string; 
  password: string; 
  role?: string;
  phone?: string;
  invitationToken?: string;
};

export type RegisterResponse = ApiResponse<{ user: User }>;

// OTP Types
export type OTPRequest = { 
  phone: string;
  restaurantId?: string;
};

export type OTPVerifyRequest = { 
  phone: string; 
  otp: string;
  restaurantId?: string;
};

export type OTPVerifyResponse = ApiResponse<{
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}>;

export type RefreshTokenRequest = { refreshToken: string };
export type RefreshTokenResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}>;

export type PasswordResetRequest = { email: string };

export type PasswordResetConfirmRequest = {
  token: string;
  password: string;
};

export type InvitationAcceptRequest = {
  token: string;
  name: string;
  password: string;
  email?: string;
};

export type GetRestaurantsParams = QueryParams;
export type GetRestaurantsResponse = ApiResponse<Restaurant[]>;

export type CreateRestaurantRequest = {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  cuisine?: string[];
};

export type UpdateRestaurantRequest = Partial<CreateRestaurantRequest>;

export type GetOrdersParams = QueryParams & {
  restaurantId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type GetOrdersResponse = ApiResponse<{
  orders: unknown[];
  meta: PaginationMeta;
}>;

export type CreateOrderRequest = {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    modifications?: string[];
  }>;
  customerId?: string;
  notes?: string;
  tableId?: string;
};

export type UpdateOrderStatusRequest = { status: string; notes?: string };

export type GetMenuParams = QueryParams & {
  restaurantId?: string;
  category?: string;
};

export type GetMenuResponse = ApiResponse<{
  items: unknown[];
  meta: PaginationMeta;
}>;

export type CreateMenuItemRequest = {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  allergens?: string[];
  preparationTime?: number;
};

export type UpdateMenuItemRequest = Partial<CreateMenuItemRequest>;

export type GetStaffParams = QueryParams & {
  restaurantId?: string;
  role?: string;
};

export type GetStaffResponse = ApiResponse<{
  staff: unknown[];
  meta: PaginationMeta;
}>;

export type CreateStaffRequest = {
  restaurantId: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  sendInvitation?: boolean;
};

export type UpdateStaffRequest = Partial<CreateStaffRequest>;

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  activeRestaurants: number;
  activeStaff: number;
  recentOrders: unknown[];
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: Record<string, number>;
  topMenuItems: { name: string; count: number; revenue: number }[];
};

export type Location = {
  id: string;
  name: string;
  address?: string;
  status: 'active' | 'paused' | 'closed';
  logo?: string;
};
