import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { UserPreferences, UpdateUserPreferencesDTO } from "@/types/preferences";

// El interceptor de axios ya convierte a/desde camelCase.
export const getPreferences = async (): Promise<UserPreferences> => {
  const response = await api.get(ENDPOINTS.USER_PREFERENCES);
  return response.data?.preferences;
};

export const updatePreferences = async (
  data: UpdateUserPreferencesDTO
): Promise<UserPreferences> => {
  const response = await api.put(ENDPOINTS.USER_PREFERENCES, data);
  return response.data?.preferences;
};
