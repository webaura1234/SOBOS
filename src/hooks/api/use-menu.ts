import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/services/api';
import type { QueryParams } from '@/types';
import type { CreateMenuItemRequest, UpdateMenuItemRequest } from '@/types/api';

export function useMenuItems(params?: QueryParams) {
  return useQuery({
    queryKey: ['menu', params],
    queryFn: () => menuApi.getAll(params).then((res) => res.data),
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: () => menuApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMenuItemRequest) => menuApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu'] }),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemRequest }) =>
      menuApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['menu', variables.id] }),
  });
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu', 'categories'],
    queryFn: () => menuApi.getCategories().then((res) => res.data),
  });
}
