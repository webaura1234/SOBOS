'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/api';
import { toast } from 'sonner';
import { Loader2, Info } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@restaurantos.com',
      password: 'demo123',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        toast.success('Welcome back!');
        router.push(callbackUrl);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Login failed');
      },
    });
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (emailInput) emailInput.value = 'demo@restaurantos.com';
    if (passwordInput) passwordInput.value = 'demo123';
  };

  return (
    <>
      {/* Demo Credentials Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Demo Mode Active</p>
            <p className="text-blue-700 mt-1">
              Use these credentials to login:
            </p>
            <div className="mt-2 space-y-1 text-blue-800 font-mono text-xs bg-blue-100/50 p-2 rounded">
              <p>Email: demo@restaurantos.com</p>
              <p>Password: demo123</p>
            </div>
            <p className="text-blue-600 text-xs mt-2">
              Or use any email with password &quot;demo&quot;
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@company.com" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
