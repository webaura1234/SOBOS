import apiClient from './client';
import type { GetStaffResponse, CreateStaffRequest } from '@/types/api';
import type { GetStaffParams } from '@/types/api';
import type { Staff } from '@/types';

export const staffApi = {
  getAll: (params?: GetStaffParams) => apiClient.get<GetStaffResponse>('/staff', { params }),
  getById: (id: string) => apiClient.get<Staff>(`/staff/${id}`),
  create: (data: CreateStaffRequest) => apiClient.post<Staff>('/staff', data),
  update: (id: string, data: Partial<CreateStaffRequest>) => apiClient.put<Staff>(`/staff/${id}`, data),
  delete: (id: string) => apiClient.delete(`/staff/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch<Staff>(`/staff/${id}/status`, { status }),
};
