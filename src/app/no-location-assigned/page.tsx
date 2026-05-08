/**
 * No Location Assigned Page
 * Shown when user has no restaurant access
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Mail, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/api/use-auth';

export default function NoLocationAssignedPage() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <Building2 className="h-10 w-10 text-gray-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">No Location Access</h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t currently have access to any restaurant locations. Please contact your administrator to get assigned to a location.
        </p>

        <div className="space-y-3">
          <a href="mailto:support@restaurantos.com">
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </a>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => logout()}
            disabled={isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
