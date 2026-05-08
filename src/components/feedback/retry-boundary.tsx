'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RetryBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  error?: Error | null;
}

export function RetryBoundary({ children, onRetry, error }: RetryBoundaryProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry?.();
    setIsRetrying(false);
  };

  if (!error) return <>{children}</>;

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="text-sm text-muted-foreground">{error.message || 'An unexpected error occurred. Please try again.'}</p>
      </div>
      {onRetry && (
        <Button onClick={handleRetry} disabled={isRetrying} variant="outline">
          <RefreshCw className={cn('mr-2 h-4 w-4', isRetrying && 'animate-spin')} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
      )}
    </div>
  );
}
