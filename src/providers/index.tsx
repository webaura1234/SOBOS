'use client';

import { type ReactNode, Suspense } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';
import { AuthProvider } from './auth-provider';
import { LocationProvider } from './location-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GlobalErrorBoundary } from '@/components/error-boundary/global-error-boundary';
import { DefaultLoadingFallback } from '@/components/loading/loading-states';

// Loading fallback for Suspense
function ProvidersLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <DefaultLoadingFallback />
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GlobalErrorBoundary
      onError={(error, errorInfo) => {
        // Send to error tracking service in production
        if (process.env.NODE_ENV === 'production') {
          console.error('Global error caught:', { error, errorInfo });
        }
      }}
    >
      <Suspense fallback={<ProvidersLoadingFallback />}>
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>
              <AuthProvider>
                <LocationProvider>
                  {children}
                  <ToastProvider />
                </LocationProvider>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </Suspense>
    </GlobalErrorBoundary>
  );
}

export default Providers;
