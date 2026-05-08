import apiClient from './client';
import type { GetOrdersResponse, CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/api';
import type { GetOrdersParams } from '@/types/api';
import type { Order } from '@/types';

export const ordersApi = {
  getAll: (params?: GetOrdersParams) => apiClient.get<GetOrdersResponse>('/orders', { params }),
  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),
  create: (data: CreateOrderRequest) => apiClient.post<Order>('/orders', data),
  updateStatus: (id: string, data: UpdateOrderStatusRequest) => apiClient.patch<Order>(`/orders/${id}/status`, data),
  cancel: (id: string, reason?: string) => apiClient.post<Order>(`/orders/${id}/cancel`, { reason }),
  getStats: (restaurantId?: string) => apiClient.get('/orders/stats', { params: { restaurantId } }),
};
