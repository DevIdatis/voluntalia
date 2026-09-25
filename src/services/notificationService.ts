import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { AppNotification, SendNotificationDTO } from "@/types/notification";

// El interceptor de axios ya convierte a/desde camelCase.
export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get(ENDPOINTS.NOTIFICATIONS);
  return response.data?.data ?? [];
};

export const sendNotification = async (data: SendNotificationDTO): Promise<void> => {
  await api.post(`${ENDPOINTS.NOTIFICATIONS}/send`, data);
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`);
};
