/**
 * Enhanced Authentication Hooks
 * Comprehensive auth flows with OTP, permissions, and session management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore, checkSessionTimeout } from '@/store/auth-store';
import { tokenManager } from '@/lib/token-manager';
import { toast } from 'sonner';
import type {
  LoginRequest,
  RegisterRequest,
  OTPRequest,
  OTPVerifyRequest,
  PasswordResetConfirmRequest,
  InvitationAcceptRequest,
} from '@/types/api';

// Login hook
export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      const { user, tokens } = data.data;
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success(`Welcome back, ${user.name}!`);
    },
    onError: (error: Error) => {
      setLoading(false);
      toast.error(error.message || 'Login failed');
    },
  });
}

// OTP Request hook
export function useRequestOTP() {
  return useMutation({
    mutationFn: authApi.requestOTP,
    onSuccess: () => {
      toast.success('OTP sent to your phone');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send OTP');
    },
  });
}

// OTP Verify hook
export function useVerifyOTP() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: (data) => {
      const { user, tokens } = data.data;
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Login successful!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid OTP');
    },
  });
}

// Register hook
export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please sign in.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

// Get profile hook
export function useProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      try {
        const data = await authApi.getProfile();
        setUser(data.data.user);
        return data;
      } finally {
        setInitialized(true);
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Logout hook
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push('/auth/login');
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Still logout locally even if API fails
      logout();
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset link');
    },
  });
}

// Reset password hook
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful! Please sign in.');
      router.push('/auth/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
}

// Accept invitation hook
export function useAcceptInvitation() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.acceptInvitation,
    onSuccess: () => {
      toast.success('Invitation accepted! You can now sign in.');
      router.push('/auth/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept invitation');
    },
  });
}

// Session management hook
export function useSessionManager() {
  const updateLastActivity = useAuthStore((state) => state.updateLastActivity);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // Update activity on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Check session timeout periodically
    const interval = setInterval(() => {
      if (checkSessionTimeout()) {
        router.push('/auth/session-expired');
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated, updateLastActivity, router]);
}

// Permission-based rendering hook
export function usePermission(permission: string, locationId?: string) {
  const hasPermission = useAuthStore((state) =>
    state.hasPermission(permission, locationId)
  );
  return { hasPermission };
}

export function usePermissions(permissions: string[], requireAll = false) {
  const checkPermission = useAuthStore((state) => state.hasPermission);

  const results = permissions.map((perm) => checkPermission(perm));
  const hasPermission = requireAll
    ? results.every(Boolean)
    : results.some(Boolean);

  return { hasPermission };
}

// Role-based hook
export function useRole(role: string) {
  const hasRole = useAuthStore((state) => state.hasRole(role));
  return { hasRole };
}

export function useAnyRole(roles: string[]) {
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole(roles));
  return { hasAnyRole };
}

// Auth guard hook
export function useAuthGuard(requireAuth = true) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!requireAuth && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, isLoading, requireAuth, router]);

  return { isAuthenticated, isLoading, isInitialized };
}
