import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

type CreateUserResponse = {
  user: User;
  country: string;
  city: string;
};

// El interceptor de axios ya convierte a/desde camelCase.
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get(ENDPOINTS.USERS);
  return response.data?.users ?? [];
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get(ENDPOINTS.ME);
  const user = response.data?.user ?? response.data;
  return { user };
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`${ENDPOINTS.USERS}/${id}`);
  return response.data.data;
};

export const createUser = async (
  user: Omit<User, 'id' | 'created_at'>
): Promise<User> => {
  const response = await api.post<CreateUserResponse>(ENDPOINTS.REGISTER, user);
  return response.data?.user ?? (response.data as unknown as User);
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await api.put(`${ENDPOINTS.USERS}/${id}`, userData);
  return response.data?.user ?? response.data;
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const response = await api.patch(`${ENDPOINTS.USERS}/${id}/toggle-status`);
  return response.data?.user ?? response.data;
};
