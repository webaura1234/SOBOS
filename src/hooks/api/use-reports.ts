import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/services/api';

export function useDashboardStats(params?: { restaurantId?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['reports', 'dashboard', params],
    queryFn: () => reportsApi.getDashboard(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueReport(params?: { restaurantId?: string; dateFrom?: string; dateTo?: string; groupBy?: 'day' | 'week' | 'month' }) {
  return useQuery({
    queryKey: ['reports', 'revenue', params],
    queryFn: () => reportsApi.getRevenue(params).then((res) => res.data),
  });
}
