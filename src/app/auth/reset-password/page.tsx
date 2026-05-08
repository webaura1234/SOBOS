/**
 * Reset Password Page
 * Set new password with token validation
 */

'use client';

import { Suspense } from 'react';
import { AuthLayout } from '@/components/layout/auth-layout';
import { PageSkeleton } from '@/components/feedback';
import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
