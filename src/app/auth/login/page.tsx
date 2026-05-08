/**
 * SOBOS Login Page
 * Split-screen: hero image left, login form right
 */

'use client';

import { Suspense } from 'react';
import { AuthLayout } from '@/components/layout/auth-layout';
import { PageSkeleton } from '@/components/feedback';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
