'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the entire app
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    this.logError(error, errorInfo);
    
    // Call optional callback
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.resetError();
    }
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Production Error:', {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } else {
      console.error('Development Error:', error, errorInfo);
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={cn('min-h-screen flex items-center justify-center p-4 bg-gray-50', this.props.className)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <Card className="border-red-200 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-red-900">
                  Something went wrong
                </CardTitle>
                <CardDescription className="text-red-700">
                  We apologize for the inconvenience. Our team has been notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error ID for support */}
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Error Reference
                  </p>
                  <p className="font-mono text-sm text-gray-700">
                    {this.state.errorId}
                  </p>
                </div>

                {/* Error details (development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-red-800">
                      <Bug className="h-4 w-4" />
                      <span className="font-medium text-sm">Error Details</span>
                    </div>
                    <p className="text-sm text-red-700 font-mono break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-red-600 overflow-auto max-h-32 bg-red-100 p-2 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={this.resetError}
                    variant="default"
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  If this problem persists, please contact support with the error reference above.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Section-level Error Boundary
 * For wrapping specific sections of the app
 */
export class SectionErrorBoundary extends Component<Props & { title?: string }, State> {
  constructor(props: Props & { title?: string }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `section-error-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Section Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-base text-amber-900">
                {this.props.title || 'Section Unavailable'}
              </CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              This section encountered an error. Please try refreshing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={this.resetError}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to use error boundary functionality
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const throwError = React.useCallback((err: Error) => {
    setError(err);
  }, []);

  if (error) {
    throw error;
  }

  return { resetError, throwError };
}

export default GlobalErrorBoundary;
