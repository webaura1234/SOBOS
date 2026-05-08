import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getAuthToken, clearAuthTokens, setAuthTokens } from '@/lib/auth';
import { ROUTES } from '@/config/routes';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: env.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              clearAuthTokens();
              window.location.href = ROUTES.public.login;
              return Promise.reject(error);
            }

            const response = await axios.post(`${env.apiUrl}/auth/refresh`, { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            setAuthTokens(accessToken, newRefreshToken);
            this.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            this.processQueue(null);
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            clearAuthTokens();
            window.location.href = ROUTES.public.login;
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private processQueue(error: unknown | null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    this.failedQueue = [];
  }

  private handleError(error: AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return { message: 'Request timeout. Please try again.', code: 'TIMEOUT' };
    }

    if (!error.response) {
      return { message: 'Network error. Please check your connection.', code: 'NETWORK_ERROR' };
    }

    const status = error.response.status;
    const data = error.response.data as Record<string, unknown>;

    const errorMessages: Record<number, string> = {
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please login again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'Conflict. This resource may already exist.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Internal server error. Please try again later.',
      502: 'Bad gateway. The server is temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
    };

    return {
      message: (data?.message as string) || errorMessages[status] || 'An unexpected error occurred.',
      code: (data?.code as string) || `HTTP_${status}`,
      status,
      details: data?.details as Record<string, string[]> | undefined,
    };
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
