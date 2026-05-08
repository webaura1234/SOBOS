/**
 * Forgot Password Page
 * Request password reset link
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/layout/auth-layout';
import { useForgotPassword } from '@/hooks/api/use-auth';
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
                <p className="text-sm text-muted-foreground">
                  No worries, we&apos;ll send you reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Reset Password
                </Button>
              </form>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a password reset link to your email address.
                </p>
              </div>
              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Back to login
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
