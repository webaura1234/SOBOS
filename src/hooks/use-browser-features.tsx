'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast as sonnerToast } from 'sonner';
import { WifiOff, CheckCircle2 } from 'lucide-react';

interface NetworkState {
  isOnline: boolean;
  isSlowConnection: boolean;
  rtt: number | null;
  saveData: boolean;
  effectiveType: string | null;
}

/**
 * Hook for monitoring network status
 */
export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    rtt: null,
    saveData: false,
    effectiveType: null,
  });

  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkState((prev) => ({ ...prev, isOnline: true }));
      if (wasOffline) {
        sonnerToast.custom(
          (t) => (
            <div className="flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg border-emerald-200 bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Connection restored</p>
                <p className="text-sm opacity-90 mt-1">You are back online</p>
              </div>
            </div>
          ),
          { duration: 4000 }
        );
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setNetworkState((prev) => ({ ...prev, isOnline: false }));
      setWasOffline(true);
      sonnerToast.custom(
        (t) => (
          <div className="flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-lg border-orange-200 bg-orange-50 text-orange-900">
            <WifiOff className="h-5 w-5 mt-0.5 shrink-0 text-orange-600" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Connection lost</p>
              <p className="text-sm opacity-90 mt-1">Please check your internet connection</p>
            </div>
          </div>
        ),
        { duration: 0 }
      );
    };

    // Monitor connection quality
    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkState((prev) => ({
          ...prev,
          isSlowConnection: connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g',
          rtt: connection.rtt,
          saveData: connection.saveData,
          effectiveType: connection.effectiveType,
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, [wasOffline]);

  return networkState;
}

/**
 * Hook for visibility detection
 */
export function useVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

/**
 * Hook for idle detection
 */
export function useIdle(timeout: number = 300000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      document.addEventListener(event, resetIdle);
    });

    resetIdle();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdle);
      });
      clearTimeout(idleTimer);
    };
  }, [timeout]);

  return isIdle;
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook for high contrast preference
 */
export function useHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)');
}

/**
 * Hook for dark mode preference
 */
export function useDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = delay - (now - lastCall.current);

      if (remaining <= 0) {
        lastCall.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          timeoutRef.current = null;
          callback(...args);
        }, remaining);
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Hook for intersection observer (lazy loading)
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [(node: Element | null) => void, IntersectionObserverEntry | null] {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);

  const observer = useCallback(
    (node: Element | null) => {
      if (!node) return;
      
      const obs = new IntersectionObserver(([entry]) => {
        setEntry(entry);
      }, options);

      obs.observe(node);
      setNode(node);

      return () => {
        obs.disconnect();
      };
    },
    [options]
  );

  return [observer, entry];
}

/**
 * Hook for window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook for scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = !!modifiers.ctrl === event.ctrlKey;
      const altMatch = !!modifiers.alt === event.altKey;
      const shiftMatch = !!modifiers.shift === event.shiftKey;
      const metaMatch = !!modifiers.meta === event.metaKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifiers]);
}

/**
 * Hook for before unload confirmation
 */
export function useBeforeUnload(shouldConfirm: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldConfirm) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldConfirm]);
}

export default useNetworkStatus;
