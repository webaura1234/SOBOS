/**
 * Session Expired Page
 * Shown when user's session times out
 */

'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { PageSkeleton } from '@/components/feedback';
import { SessionExpiredContent } from './session-expired-content';

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<PageSkeleton />}>
        <SessionExpiredContent />
      </Suspense>
    </div>
  );
}
