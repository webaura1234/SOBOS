/**
 * Enterprise JWT Authentication System
 * Handles token management, refresh queue, and secure storage
 */

import { env } from '@/config/env';

// Token storage keys
const ACCESS_TOKEN_KEY = 'ros_access_token';
const REFRESH_TOKEN_KEY = 'ros_refresh_token';
const TOKEN_EXPIRY_KEY = 'ros_token_expiry';
const USER_DATA_KEY = 'ros_user_data';

// Token refresh queue to prevent concurrent refresh requests
type RefreshSubscriber = (token: string) => void;

class TokenManager {
  private isRefreshing = false;
  private refreshSubscribers: RefreshSubscriber[] = [];
  private refreshPromise: Promise<string> | null = null;

  // Subscribe to token refresh
  subscribeToRefresh(callback: RefreshSubscriber): () => void {
    this.refreshSubscribers.push(callback);
    return () => {
      this.refreshSubscribers = this.refreshSubscribers.filter((cb) => cb !== callback);
    };
  }

  // Notify all subscribers with new token
  private notifySubscribers(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    // Check if token is expired
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      this.clearTokens();
      return null;
    }
    
    return token;
  }

  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Set tokens
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;
    
    const expiryTime = Date.now() + expiresIn * 1000;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  // Clear all tokens
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Check if token needs refresh (expires in less than 5 minutes)
  shouldRefreshToken(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    const expiryTime = parseInt(expiry, 10);
    const fiveMinutes = 5 * 60 * 1000;
    
    return Date.now() > expiryTime - fiveMinutes;
  }

  // Refresh token with queue management
  async refreshAccessToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    
    this.refreshPromise = this.performTokenRefresh(refreshToken)
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${env.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      this.setTokens(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.expiresIn || 3600
      );

      // Notify all subscribers
      this.notifySubscribers(data.data.accessToken);

      return data.data.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Store user data
  setUserData(user: unknown): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  // Get user data
  getUserData<T>(): T | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }
}

// Singleton instance
export const tokenManager = new TokenManager();

// Multi-tab synchronization
export function syncAuthAcrossTabs(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_KEY) {
      if (!event.newValue) {
        // Token was removed (logout)
        callback();
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}
