import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/services/api';
import type { GetStaffParams, CreateStaffRequest } from '@/types/api';

export function useStaff(params?: GetStaffParams) {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => staffApi.getAll(params).then((res) => res.data),
  });
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffApi.create(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStaffRequest> }) =>
      staffApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['staff', variables.id] }),
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}
