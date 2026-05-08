import type { User } from '@/types';
import type { LoginRequest, RegisterRequest } from '@/types/api';

// Demo user data
const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@restaurantos.com',
  name: 'Demo Manager',
  role: 'manager',
  avatar: '',
  permissions: [
    'manage:restaurants',
    'manage:orders',
    'manage:menu',
    'manage:staff',
    'view:reports',
    'manage:settings',
  ],
  restaurantIds: ['demo-restaurant-001'],
  currentLocationId: 'demo-restaurant-001',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_CREDENTIALS = {
  email: 'demo@restaurantos.com',
  password: 'demo123',
};

const MOCK_TOKEN = 'mock-jwt-token-demo-' + Date.now();
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-demo-' + Date.now();

/**
 * Mock authentication service for development/demo purposes
 */
export const mockAuth = {
  login: async (data: LoginRequest): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check credentials (accept demo credentials or any email with password "demo")
    if (data.email === DEMO_CREDENTIALS.email && data.password === DEMO_CREDENTIALS.password) {
      return {
        user: DEMO_USER,
        tokens: {
          accessToken: MOCK_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
        },
      };
    }

    // Also accept any email with password "demo" for quick testing
    if (data.password === 'demo') {
      return {
        user: { ...DEMO_USER, email: data.email, name: data.email.split('@')[0] },
        tokens: {
          accessToken: MOCK_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
        },
      };
    }

    throw new Error('Invalid email or password');
  },

  register: async (data: RegisterRequest): Promise<{ user: User }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      name: data.name,
      role: data.role || 'manager',
      avatar: '',
      permissions: [
        'manage:restaurants',
        'manage:orders',
        'manage:menu',
        'manage:staff',
        'view:reports',
        'manage:settings',
      ],
      restaurantIds: [],
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: newUser };
  },

  getProfile: async (): Promise<{ user: User }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return demo user if token exists
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    return { user: DEMO_USER };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Clear tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      accessToken: MOCK_TOKEN + '-refreshed',
      refreshToken: MOCK_REFRESH_TOKEN + '-refreshed',
    };
  },
};

// Store mock token in localStorage for persistence
export const setMockTokens = () => {
  localStorage.setItem('auth_token', MOCK_TOKEN);
  localStorage.setItem('refresh_token', MOCK_REFRESH_TOKEN);
};
