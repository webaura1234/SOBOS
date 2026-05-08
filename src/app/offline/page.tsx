'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      // Redirect to previous page or dashboard after short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  }, [isOnline, router]);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Try to reconnect
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      
      if (response.ok) {
        setIsOnline(true);
      }
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false);
    }
  };

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              </div>
              <CardTitle className="text-xl text-emerald-900">
                Connection Restored
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Redirecting you back...
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl text-orange-900">
              You are offline
            </CardTitle>
            <CardDescription className="text-orange-700">
              Please check your internet connection and try again
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-orange-800 font-medium">
                What you can do:
              </p>
              <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                <li>Check your Wi-Fi or mobile data connection</li>
                <li>Try refreshing the page</li>
                <li>Wait a moment and try again</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex-1"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Some features may be unavailable while offline.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
