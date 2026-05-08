'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesReached?: (error: Error) => void;
}

interface RetryState<T> {
  data: T | null;
  isLoading: boolean;
  isRetrying: boolean;
  error: Error | null;
  retryCount: number;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
  onMaxRetriesReached: () => {},
};

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, config: Required<RetryConfig>): number {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add 0-30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelay);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any, config: Required<RetryConfig>): boolean {
  // Network errors
  if (error.name === 'TypeError' || error.name === 'NetworkError') {
    return true;
  }

  // HTTP status codes
  if (error.status && config.retryableStatuses.includes(error.status)) {
    return true;
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return true;
  }

  return false;
}

/**
 * Hook for API operations with automatic retry logic
 */
export function useRetry<T>(
  operation: (...args: any[]) => Promise<T>,
  config: RetryConfig = {}
): RetryState<T> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    isRetrying: boolean;
    error: Error | null;
    retryCount: number;
  }>({
    data: null,
    isLoading: false,
    isRetrying: false,
    error: null,
    retryCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Cancel any pending request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        isLoading: true,
        isRetrying: false,
        error: null,
        retryCount: 0,
      }));

      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
        try {
          const result = await operation(...args, {
            signal: abortControllerRef.current.signal,
          });

          if (isMountedRef.current) {
            setState({
              data: result,
              isLoading: false,
              isRetrying: false,
              error: null,
              retryCount: attempt,
            });
          }

          return result;
        } catch (error: any) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // Don't retry if request was aborted
          if (error.name === 'AbortError') {
            if (isMountedRef.current) {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                isRetrying: false,
              }));
            }
            return null;
          }

          // Check if we should retry
          const shouldRetry =
            attempt < mergedConfig.maxRetries &&
            isRetryableError(error, mergedConfig);

          if (shouldRetry) {
            if (isMountedRef.current) {
              setState((prev) => ({
                ...prev,
                isRetrying: true,
                retryCount: attempt + 1,
              }));
            }

            mergedConfig.onRetry(attempt + 1, lastError);

            // Wait before retrying
            const delay = calculateDelay(attempt, mergedConfig);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // Max retries reached or non-retryable error
            if (isMountedRef.current) {
              setState({
                data: null,
                isLoading: false,
                isRetrying: false,
                error: lastError,
                retryCount: attempt,
              });
            }

            if (attempt >= mergedConfig.maxRetries) {
              mergedConfig.onMaxRetriesReached(lastError);
            }

            return null;
          }
        }
      }

      return null;
    },
    [operation, mergedConfig]
  );

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      data: null,
      isLoading: false,
      isRetrying: false,
      error: null,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Circuit Breaker Pattern
 * Prevents cascading failures by temporarily rejecting requests when errors are frequent
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();

  constructor(
    private failureThreshold = 5,
    private successThreshold = 2,
    private timeout = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'half-open';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;

    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'closed';
        this.successCount = 0;
      }
    }
  }

  private onFailure() {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }

  getState() {
    return this.state;
  }
}

/**
 * Hook for optimistic updates with rollback capability
 */
export function useOptimistic<T>(
  initialValue: T,
  updateFn: (current: T, optimisticValue: any) => T
) {
  const [state, setState] = useState<T>(initialValue);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const rollbackRef = useRef<T | null>(null);

  const applyOptimistic = useCallback(
    (optimisticValue: any) => {
      rollbackRef.current = state;
      setState((current) => updateFn(current, optimisticValue));
      setIsOptimistic(true);
    },
    [state, updateFn]
  );

  const confirm = useCallback(() => {
    rollbackRef.current = null;
    setIsOptimistic(false);
  }, []);

  const rollback = useCallback(() => {
    if (rollbackRef.current !== null) {
      setState(rollbackRef.current);
      rollbackRef.current = null;
    }
    setIsOptimistic(false);
  }, []);

  return {
    state,
    isOptimistic,
    applyOptimistic,
    confirm,
    rollback,
    setState,
  };
}

/**
 * Create a retry wrapper for any async function
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: RetryConfig = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));

        const shouldRetry =
          attempt < mergedConfig.maxRetries &&
          isRetryableError(error, mergedConfig);

        if (shouldRetry) {
          mergedConfig.onRetry(attempt + 1, lastError);
          const delay = calculateDelay(attempt, mergedConfig);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          if (attempt >= mergedConfig.maxRetries) {
            mergedConfig.onMaxRetriesReached(lastError);
          }
          throw lastError;
        }
      }
    }

    throw lastError;
  };
}

export default useRetry;
