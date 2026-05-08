'use client';

import { useCallback } from 'react';
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn as mergeClasses } from '@/lib/utils';

// Toast types with their configurations
const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900',
    iconClassName: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    iconClassName: 'text-amber-600',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900',
    iconClassName: 'text-blue-600',
  },
  loading: {
    icon: Loader2,
    className: 'border-gray-200 bg-gray-50 text-gray-900',
    iconClassName: 'text-gray-600 animate-spin',
  },
  offline: {
    icon: WifiOff,
    className: 'border-orange-200 bg-orange-50 text-orange-900',
    iconClassName: 'text-orange-600',
  },
};

type ToastType = keyof typeof toastConfig;

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

/**
 * Custom toast hook with enhanced functionality
 */
export function useToast() {
  const showToast = useCallback((
    type: ToastType,
    title: string,
    options: ToastOptions = {}
  ) => {
    const config = toastConfig[type];
    const Icon = config.icon;

    return sonnerToast.custom(
      (t) => (
        <div
          className={mergeClasses(
            'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg',
            config.className
          )}
          role="alert"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
        >
          <Icon className={mergeClasses('h-5 w-5 mt-0.5 shrink-0', config.iconClassName)} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{title}</p>
            {options.description && (
              <p className="text-sm opacity-90 mt-1">{options.description}</p>
            )}
            {options.action && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 mt-2 text-inherit underline"
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(t);
                }}
              >
                {options.action.label}
              </Button>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ),
      {
        duration: options.duration || (type === 'error' ? 5000 : 4000),
        onDismiss: options.onDismiss,
        onAutoClose: options.onAutoClose,
      }
    );
  }, []);

  const success = useCallback((title: string, options?: ToastOptions) => {
    return showToast('success', title, options);
  }, [showToast]);

  const error = useCallback((title: string, options?: ToastOptions) => {
    return showToast('error', title, options);
  }, [showToast]);

  const warning = useCallback((title: string, options?: ToastOptions) => {
    return showToast('warning', title, options);
  }, [showToast]);

  const info = useCallback((title: string, options?: ToastOptions) => {
    return showToast('info', title, options);
  }, [showToast]);

  const loading = useCallback((title: string, options?: ToastOptions) => {
    return showToast('loading', title, { ...options, duration: Infinity });
  }, [showToast]);

  const offline = useCallback((title: string, options?: ToastOptions) => {
    return showToast('offline', title, { ...options, duration: 0 });
  }, [showToast]);

  const promise = useCallback(<T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...options,
    });
  }, []);

  const dismiss = useCallback((toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  }, []);

  return {
    show: showToast,
    success,
    error,
    warning,
    info,
    loading,
    offline,
    promise,
    dismiss,
  };
}

/**
 * Toast provider component
 * Wraps the app with toast functionality
 */
export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        },
      }}
      closeButton={false}
      richColors
      expand
      visibleToasts={5}
    />
  );
}

/**
 * Standalone toast functions for use outside of components
 */
export const toast = {
  success: (title: string, options?: ToastOptions) => {
    const config = toastConfig.success;
    const Icon = config.icon;
    
    sonnerToast.custom(
      (t) => (
        <div
          className={mergeClasses(
            'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg',
            config.className
          )}
          role="alert"
        >
          <Icon className={mergeClasses('h-5 w-5 mt-0.5 shrink-0', config.iconClassName)} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{title}</p>
            {options?.description && (
              <p className="text-sm opacity-90 mt-1">{options.description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ),
      { duration: options?.duration || 4000 }
    );
  },
  
  error: (title: string, options?: ToastOptions) => {
    const config = toastConfig.error;
    const Icon = config.icon;
    
    sonnerToast.custom(
      (t) => (
        <div
          className={mergeClasses(
            'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg',
            config.className
          )}
          role="alert"
          aria-live="assertive"
        >
          <Icon className={mergeClasses('h-5 w-5 mt-0.5 shrink-0', config.iconClassName)} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{title}</p>
            {options?.description && (
              <p className="text-sm opacity-90 mt-1">{options.description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ),
      { duration: options?.duration || 5000 }
    );
  },

  
  offline: (title: string, options?: ToastOptions) => {
    const config = toastConfig.offline;
    const Icon = config.icon;
    
    sonnerToast.custom(
      (t) => (
        <div
          className={mergeClasses(
            'flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg',
            config.className
          )}
          role="alert"
        >
          <Icon className={mergeClasses('h-5 w-5 mt-0.5 shrink-0', config.iconClassName)} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{title}</p>
            {options?.description && (
              <p className="text-sm opacity-90 mt-1">{options.description}</p>
            )}
          </div>
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ),
      { duration: 0 } // Never auto-dismiss offline notifications
    );
  },

  dismiss: sonnerToast.dismiss,
};

export default useToast;
