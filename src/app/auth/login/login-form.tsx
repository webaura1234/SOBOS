'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin, useRequestOTP, useVerifyOTP } from '@/hooks/api/use-auth';
import { toast } from 'sonner';
import { Loader2, Mail, Phone, ArrowRight, ChefHat } from 'lucide-react';
import { SplashAnimation } from '@/components/splash/splash-animation';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpRequestSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

const otpVerifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OTPRequestData = z.infer<typeof otpRequestSchema>;
type OTPVerifyData = z.infer<typeof otpVerifySchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSplash, setShowSplash] = useState(false);

  const { mutate: login, isPending: isLoggingIn } = useLogin({
    onSuccess: () => setShowSplash(true),
  });
  const { mutate: requestOTP, isPending: isRequestingOTP } = useRequestOTP();
  const { mutate: verifyOTP, isPending: isVerifyingOTP } = useVerifyOTP({
    onSuccess: () => setShowSplash(true),
  });

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: 'demo@restaurantos.com',
      password: 'demo123',
    },
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<OTPRequestData>({
    resolver: zodResolver(otpRequestSchema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPVerifyData>({
    resolver: zodResolver(otpVerifySchema),
  });

  const onEmailSubmit = (data: EmailFormData) => {
    login(data);
  };

  const onPhoneSubmit = (data: OTPRequestData) => {
    requestOTP(
      { phone: data.phone, restaurantId: 'rst_001' },
      {
        onSuccess: () => {
          setPhoneNumber(data.phone);
          setOtpSent(true);
        },
      }
    );
  };

  const onOTPSubmit = (data: OTPVerifyData) => {
    verifyOTP({ phone: phoneNumber, otp: data.otp, restaurantId: 'rst_001' });
  };

  const handleSplashComplete = () => {
    router.push(callbackUrl);
  };

  return (
    <div className="space-y-6">
      {/* Logo — top of right panel, exactly like SOBOS reference */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-brand)' }}>
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-black text-base tracking-tight text-gray-900">SOBOS</p>
          <p className="text-[9px] uppercase tracking-widest font-semibold text-gray-400">Restaurant POS</p>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Login to manage your restaurant operations.</p>
      </div>

      <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as 'email' | 'otp')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="otp" className="gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-4">
          <motion.form
            key="email-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleEmailSubmit(onEmailSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                {...registerEmail('email')}
                aria-invalid={!!emailErrors.email}
                aria-describedby={emailErrors.email ? 'email-error' : undefined}
              />
              {emailErrors.email && (
                <p id="email-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                  {emailErrors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...registerEmail('password')}
                aria-invalid={!!emailErrors.password}
                aria-describedby={emailErrors.password ? 'password-error' : undefined}
              />
              {emailErrors.password && (
                <p id="password-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                  {emailErrors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </motion.form>
        </TabsContent>

        <TabsContent value="otp" className="mt-4">
          {!otpSent ? (
            <motion.form
              key="otp-request-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handlePhoneSubmit(onPhoneSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...registerPhone('phone')}
                  aria-invalid={!!phoneErrors.phone}
                  aria-describedby={phoneErrors.phone ? 'phone-error' : undefined}
                />
                {phoneErrors.phone && (
                  <p id="phone-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {phoneErrors.phone.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send you a one-time password to verify your identity
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isRequestingOTP}>
                {isRequestingOTP ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Send OTP
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-verify-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleOTPSubmit(onOTPSubmit)}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to</p>
                <p className="font-medium">{phoneNumber}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  {...registerOTP('otp')}
                  aria-invalid={!!otpErrors.otp}
                  aria-describedby={otpErrors.otp ? 'otp-error' : undefined}
                />
                {otpErrors.otp && (
                  <p id="otp-error" className="text-sm text-red-500" role="alert" aria-live="polite">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifyingOTP}>
                {isVerifyingOTP ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Verify & Sign In
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setOtpSent(false)}>
                Change phone number
              </Button>
            </motion.form>
          )}
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary hover:underline">
          Create account
        </Link>
      </p>

      {/* Demo Credentials */}
      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-muted-foreground">
          <p>Admin: admin@restaurantos.com / admin123</p>
          <p>Manager: demo@restaurantos.com / demo123</p>
          <p>Owner: owner@bella.com / owner123</p>
        </div>
      </div>

      <AnimatePresence>
        {showSplash && <SplashAnimation onComplete={handleSplashComplete} />}
      </AnimatePresence>
    </div>
  );
}
