/**
 * Enhanced Auth Store
 * Manages authentication state, user data, and session persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenManager } from '@/lib/token-manager';
import { syncAuthAcrossTabs } from '@/lib/token-manager';
import type { User } from '@/types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  lastActivity: number;
  sessionExpiry: number | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
  updateLastActivity: () => void;
  logout: () => void;

  // Permission checks
  hasPermission: (permission: string, locationId?: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;

  // Location
  setCurrentLocation: (locationId: string) => void;
  getCurrentLocation: () => string | undefined;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      lastActivity: Date.now(),
      sessionExpiry: null,

      setUser: (user) => {
        if (user) {
          tokenManager.setUserData(user);
          set({
            user,
            isAuthenticated: true,
            lastActivity: Date.now(),
            sessionExpiry: Date.now() + SESSION_TIMEOUT,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            sessionExpiry: null,
          });
        }
      },

      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setInitialized: (value) => set({ isInitialized: value }),

      updateLastActivity: () => {
        set({
          lastActivity: Date.now(),
          sessionExpiry: Date.now() + SESSION_TIMEOUT,
        });
      },

      logout: () => {
        tokenManager.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          sessionExpiry: null,
        });
      },

      hasPermission: (permission, locationId) => {
        const { user } = get();
        if (!user) return false;

        // Platform admin has all permissions
        if (user.role === 'platform_admin' || user.permissions?.includes('*')) {
          return true;
        }

        // Check global permission
        const hasGlobal = user.permissions?.includes(permission);

        // Check location-specific permission
        const targetLocation = locationId || user.currentLocationId;
        const locationPerms = targetLocation
          ? user.locationPermissions?.[targetLocation]
          : undefined;
        const hasLocation =
          locationPerms?.includes(permission) || locationPerms?.includes('all');

        return hasGlobal || hasLocation || false;
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role || '');
      },

      setCurrentLocation: (locationId) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, currentLocationId: locationId },
          });
        }
      },

      getCurrentLocation: () => {
        return get().user?.currentLocationId;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        sessionExpiry: state.sessionExpiry,
      }),
    }
  )
);

// Initialize auth state from storage
export function initializeAuth(): () => void {
  const unsubscribe = syncAuthAcrossTabs(() => {
    // Handle logout from other tabs
    useAuthStore.getState().logout();
  });

  // Check for existing session
  const token = tokenManager.getAccessToken();
  const user = tokenManager.getUserData<User>();

  if (token && user) {
    useAuthStore.setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    });
  } else {
    useAuthStore.setState({
      isLoading: false,
      isInitialized: true,
    });
  }

  return unsubscribe;
}

// Session timeout check
export function checkSessionTimeout(): boolean {
  const state = useAuthStore.getState();

  if (!state.isAuthenticated || !state.sessionExpiry) {
    return false;
  }

  if (Date.now() > state.sessionExpiry) {
    state.logout();
    return true;
  }

  return false;
}
