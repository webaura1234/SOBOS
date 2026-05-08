import apiClient from './client';
import type { GetRestaurantsResponse, CreateRestaurantRequest, UpdateRestaurantRequest } from '@/types/api';
import type { QueryParams, Restaurant } from '@/types';

export const restaurantsApi = {
  getAll: (params?: QueryParams) => apiClient.get<GetRestaurantsResponse>('/restaurants', { params }),
  getById: (id: string) => apiClient.get<Restaurant>(`/restaurants/${id}`),
  create: (data: CreateRestaurantRequest) => apiClient.post<Restaurant>('/restaurants', data),
  update: (id: string, data: UpdateRestaurantRequest) => apiClient.put<Restaurant>(`/restaurants/${id}`, data),
  delete: (id: string) => apiClient.delete(`/restaurants/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch(`/restaurants/${id}/status`, { status }),
  getStats: (id: string) => apiClient.get(`/restaurants/${id}/stats`),
};
