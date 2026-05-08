/**
 * Unauthorized Page
 * Shown when user lacks required permissions
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
          <Shield className="h-10 w-10 text-amber-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have permission to access this page. Please contact your administrator if you think this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link href="/dashboard">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
