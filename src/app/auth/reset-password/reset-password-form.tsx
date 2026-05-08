'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/api/use-auth';
import { Loader2, Lock, CheckCircle2, XCircle } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    // Validate token
    if (!token) {
      setIsValidating(false);
      setIsValid(false);
      return;
    }

    // Simulate token validation
    setTimeout(() => {
      setIsValidating(false);
      setIsValid(true);
    }, 1000);
  }, [token]);

  const onSubmit = (data: ResetPasswordData) => {
    if (!token) return;

    resetPassword({
      token,
      password: data.password,
    });
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Validating reset link...</p>
      </div>
    );
  }

  if (!isValid || !token) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Invalid or expired link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is no longer valid. Please request a new one.
          </p>
        </div>
        <Button onClick={() => router.push('/auth/forgot-password')}>
          Request new link
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Your new password must be different from previous passwords
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          {/* Password strength indicator */}
          {password && (
            <div className="space-y-1">
              <div className="flex gap-1 h-1">
                <div
                  className={`flex-1 rounded ${
                    password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`flex-1 rounded ${
                    /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`flex-1 rounded ${
                    /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
                <div
                  className={`flex-1 rounded ${
                    /[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use 8+ characters with uppercase, numbers & symbols
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Reset Password
        </Button>
      </form>
    </motion.div>
  );
}
