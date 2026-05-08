'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, LogIn } from 'lucide-react';

export function SessionExpiredContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full text-center"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
        <Clock className="h-10 w-10 text-blue-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Session Expired</h1>
      <p className="text-muted-foreground mb-6">
        Your session has expired due to inactivity. Please sign in again to continue.
      </p>

      <div className="bg-white rounded-lg p-4 mb-6 text-left">
        <p className="text-sm text-muted-foreground mb-2">For security, sessions automatically expire after:</p>
        <p className="font-medium">30 minutes of inactivity</p>
      </div>

      <Link href={`/auth/login?callbackUrl=${encodeURIComponent(redirectUrl)}`}>
        <Button className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In Again
        </Button>
      </Link>
    </motion.div>
  );
}
