import apiClient from './client';
import type { GetMenuResponse, CreateMenuItemRequest, UpdateMenuItemRequest } from '@/types/api';
import type { QueryParams, MenuItem } from '@/types';

export const menuApi = {
  getAll: (params?: QueryParams) => apiClient.get<GetMenuResponse>('/menu', { params }),
  getById: (id: string) => apiClient.get<MenuItem>(`/menu/${id}`),
  create: (data: CreateMenuItemRequest) => apiClient.post<MenuItem>('/menu', data),
  update: (id: string, data: UpdateMenuItemRequest) => apiClient.put<MenuItem>(`/menu/${id}`, data),
  delete: (id: string) => apiClient.delete(`/menu/${id}`),
  toggleAvailability: (id: string, isAvailable: boolean) => apiClient.patch<MenuItem>(`/menu/${id}/availability`, { isAvailable }),
  getCategories: () => apiClient.get<string[]>('/menu/categories'),
};
