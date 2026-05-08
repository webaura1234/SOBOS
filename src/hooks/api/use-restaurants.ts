import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from '@/services/api';
import type { QueryParams } from '@/types';
import type { CreateRestaurantRequest, UpdateRestaurantRequest } from '@/types/api';

export function useRestaurants(params?: QueryParams) {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => restaurantsApi.getAll(params).then((res) => res.data),
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurants', id],
    queryFn: () => restaurantsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRestaurantRequest) => restaurantsApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRestaurantRequest }) =>
      restaurantsApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['restaurants', variables.id] }),
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restaurantsApi.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
  });
}
