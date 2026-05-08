/**
 * Auth Provider
 * Initializes auth state and handles session management
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore, initializeAuth } from '@/store/auth-store';
import { useProfile } from '@/hooks/api/use-auth';
import { useSessionManager } from '@/hooks/api/use-auth';
import { tokenManager } from '@/lib/token-manager';
import type { User } from '@/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setInitialized } = useAuthStore();
  
  // Initialize session timeout monitoring
  useSessionManager();

  // Only fetch profile if we have a token (prevents race condition with initializeAuth)
  const hasToken = typeof window !== 'undefined' && !!tokenManager.getAccessToken();
  const { data, isLoading, error } = useProfile({ enabled: hasToken });

  useEffect(() => {
    // Initialize from storage
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (data?.data && !isLoading) {
      // Handle both API response formats
      const responseData = data.data as { user?: User } | User | undefined;
      if (responseData) {
        const user = 'user' in responseData ? responseData.user : responseData;
        if (user) {
          setUser(user as User);
        }
      }
    }
    
    if (error) {
      // Profile fetch failed, clear auth state
      setInitialized(true);
    }
  }, [data, isLoading, error, setUser, setInitialized]);

  return children;
}
