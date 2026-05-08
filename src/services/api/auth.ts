/**
 * Authentication API Layer
 * Handles all auth flows: JWT, OTP, password reset, invitations
 */

import apiClient from './client';
import { tokenManager } from '@/lib/token-manager';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OTPRequest,
  OTPVerifyRequest,
  OTPVerifyResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  InvitationAcceptRequest,
  RefreshTokenResponse,
} from '@/types/api';
import type { User } from '@/types';

// Mock mode flag - set to false when connecting to real backend
const USE_MOCK_AUTH = true;

// Mock data for development
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'demo@restaurantos.com': {
    user: {
      id: 'usr_001',
      email: 'demo@restaurantos.com',
      name: 'Demo Manager',
      role: 'manager',
      avatar: '',
      permissions: [
        'restaurant:manage',
        'menu:manage',
        'orders:manage',
        'staff:view',
        'reports:view',
        'kitchen:view',
        'inventory:manage',
        'tables:manage',
      ],
      restaurantIds: ['rst_001', 'rst_002'],
      currentLocationId: 'rst_001',
      locationPermissions: {
        rst_001: ['all'],
        rst_002: ['orders:manage', 'menu:view'],
      },
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    password: 'demo123',
  },
  'admin@restaurantos.com': {
    user: {
      id: 'usr_admin_001',
      email: 'admin@restaurantos.com',
      name: 'Platform Admin',
      role: 'platform_admin',
      avatar: '',
      permissions: ['*'],
      restaurantIds: [],
      currentLocationId: undefined,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    password: 'admin123',
  },
  'owner@bella.com': {
    user: {
      id: 'usr_owner_001',
      email: 'owner@bella.com',
      name: 'Restaurant Owner',
      role: 'restaurant_owner',
      avatar: '',
      permissions: [
        'restaurant:manage',
        'restaurant:view',
        'menu:manage',
        'menu:view',
        'orders:manage',
        'orders:view',
        'staff:manage',
        'staff:view',
        'inventory:manage',
        'inventory:view',
        'reports:view',
        'reports:export',
        'reports:view_financials',
        'kitchen:view',
        'tables:manage',
        'tables:view',
        'settings:manage',
        'settings:view',
      ],
      restaurantIds: ['rst_bella_001'],
      currentLocationId: 'rst_bella_001',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    password: 'owner123',
  },
};

// Mock OTP storage
const mockOTPStore = new Map<string, { otp: string; expiresAt: number }>();

// Generate mock JWT
function generateMockJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 3600 * 1000,
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

// Mock API functions
async function mockLogin(data: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const userEntry = Object.entries(MOCK_USERS).find(
    ([email, _]) => email === data.email
  );

  if (!userEntry || userEntry[1].password !== data.password) {
    throw new Error('Invalid email or password');
  }

  const { user } = userEntry[1];
  const accessToken = generateMockJWT(user);
  const refreshToken = btoa(`refresh-${user.id}-${Date.now()}`);

  tokenManager.setTokens(accessToken, refreshToken, 3600);
  tokenManager.setUserData(user);

  return {
    success: true,
    data: {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      },
    },
  };
}

async function mockRequestOTP(data: OTPRequest): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  mockOTPStore.set(data.phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  console.log(`[MOCK OTP] Code for ${data.phone}: ${otp}`);

  return { success: true };
}

async function mockVerifyOTP(data: OTPVerifyRequest): Promise<OTPVerifyResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stored = mockOTPStore.get(data.phone);

  if (!stored || stored.otp !== data.otp || Date.now() > stored.expiresAt) {
    throw new Error('Invalid or expired OTP');
  }

  mockOTPStore.delete(data.phone);

  // Create or get customer user
  const user: User = {
    id: `usr_cust_${Date.now()}`,
    email: `${data.phone}@customer.temp`,
    name: 'Guest Customer',
    role: 'customer',
    avatar: '',
    permissions: ['customer:place_orders', 'customer:view_history'],
    restaurantIds: [data.restaurantId || 'rst_001'],
    currentLocationId: data.restaurantId || 'rst_001',
    phone: data.phone,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const accessToken = generateMockJWT(user);
  const refreshToken = btoa(`refresh-${user.id}-${Date.now()}`);

  tokenManager.setTokens(accessToken, refreshToken, 3600);
  tokenManager.setUserData(user);

  return {
    success: true,
    data: {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      },
    },
  };
}

// Auth API exports
export const authApi = {
  // Email/Password Login
  login: (data: LoginRequest) => {
    if (USE_MOCK_AUTH) {
      return mockLogin(data);
    }
    return apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data);
  },

  // OTP Request
  requestOTP: (data: OTPRequest) => {
    if (USE_MOCK_AUTH) {
      return mockRequestOTP(data);
    }
    return apiClient.post<{ success: boolean }>('/auth/otp/request', data).then((r) => r.data);
  },

  // OTP Verify
  verifyOTP: (data: OTPVerifyRequest) => {
    if (USE_MOCK_AUTH) {
      return mockVerifyOTP(data);
    }
    return apiClient.post<OTPVerifyResponse>('/auth/otp/verify', data).then((r) => r.data);
  },

  // Register
  register: (data: RegisterRequest) => {
    if (USE_MOCK_AUTH) {
      return new Promise<RegisterResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              user: {
                id: `usr_${Date.now()}`,
                email: data.email,
                name: data.name,
                role: data.role || 'manager',
                avatar: '',
                permissions: [],
                restaurantIds: [],
                onboardingCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          });
        }, 800);
      });
    }
    return apiClient.post<RegisterResponse>('/auth/register', data).then((r) => r.data);
  },

  // Get Profile
  getProfile: () => {
    if (USE_MOCK_AUTH) {
      return new Promise<{ data: { user: User } }>((resolve, reject) => {
        setTimeout(() => {
          const user = tokenManager.getUserData<User>();
          if (user) {
            resolve({ data: { user } });
          } else {
            reject(new Error('Not authenticated'));
          }
        }, 300);
      });
    }
    return apiClient.get<{ data: { user: User } }>('/auth/profile').then((r) => r.data);
  },

  // Update Profile
  updateProfile: (data: Partial<User>) => {
    return apiClient.put('/auth/profile', data).then((r) => r.data);
  },

  // Refresh Token
  refreshToken: (refreshToken: string) => {
    return apiClient
      .post<RefreshTokenResponse>('/auth/refresh', { refreshToken })
      .then((r) => r.data);
  },

  // Logout
  logout: () => {
    tokenManager.clearTokens();
    return apiClient.post('/auth/logout').then((r) => r.data);
  },

  // Change Password
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return apiClient.post('/auth/change-password', data).then((r) => r.data);
  },

  // Forgot Password
  forgotPassword: (email: string) => {
    return apiClient.post('/auth/forgot-password', { email }).then((r) => r.data);
  },

  // Reset Password
  resetPassword: (data: PasswordResetConfirmRequest) => {
    return apiClient.post('/auth/reset-password', data).then((r) => r.data);
  },

  // Accept Invitation
  acceptInvitation: (data: InvitationAcceptRequest) => {
    return apiClient.post('/auth/invitation/accept', data).then((r) => r.data);
  },

  // Verify Email
  verifyEmail: (token: string) => {
    return apiClient.post('/auth/verify-email', { token }).then((r) => r.data);
  },
};

// Location switching
export const locationApi = {
  switchLocation: (locationId: string) => {
    return apiClient
      .post('/auth/switch-location', { locationId })
      .then((r) => r.data);
  },

  getLocations: () => {
    return apiClient.get('/auth/locations').then((r) => r.data);
  },
};
