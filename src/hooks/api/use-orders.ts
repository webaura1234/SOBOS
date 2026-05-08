import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import type { GetOrdersParams, CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/api';

export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getAll(params).then((res) => res.data),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      ordersApi.updateStatus(id, data).then((res) => res.data),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['orders', variables.id] }),
  });
}
