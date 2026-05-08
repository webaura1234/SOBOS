import apiClient from './client';
import type { DashboardStats, ApiResponse } from '@/types/api';

export const reportsApi = {
  getDashboard: (params?: { restaurantId?: string; dateFrom?: string; dateTo?: string }) =>
    apiClient.get<ApiResponse<DashboardStats>>('/reports/dashboard', { params }),
  getRevenue: (params?: { restaurantId?: string; dateFrom?: string; dateTo?: string; groupBy?: 'day' | 'week' | 'month' }) =>
    apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/revenue', { params }),
  getOrders: (params?: { restaurantId?: string; dateFrom?: string; dateTo?: string }) =>
    apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/orders', { params }),
  getMenuPerformance: (params?: { restaurantId?: string; dateFrom?: string; dateTo?: string }) =>
    apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/menu-performance', { params }),
  exportReport: (type: string, params?: Record<string, unknown>) =>
    apiClient.get(`/reports/export/${type}`, { params, responseType: 'blob' }),
};
