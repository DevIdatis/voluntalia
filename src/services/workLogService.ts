import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { WorkLog, CreateWorkLogDTO, UpdateWorkLogDTO } from "@/types/workLog";

// El interceptor de axios ya convierte a/desde camelCase.
export const getWorkLogsByUser = async (): Promise<WorkLog[]> => {
  const response = await api.get(`${ENDPOINTS.WORKLOG}/me`);
  return response.data?.worklog ?? [];
};

// * COORDINATOR only: fetch another user's worklog entries
export const getWorkLogsForUser = async (userId: string): Promise<WorkLog[]> => {
  const response = await api.get(`${ENDPOINTS.WORKLOG}/user/${userId}`);
  return response.data?.worklog ?? [];
};

export const createWorkLog = async (workLogData: CreateWorkLogDTO): Promise<WorkLog> => {
  const response = await api.post(`${ENDPOINTS.WORKLOG}/create`, workLogData);
  return response.data?.worklog ?? response.data;
};

export const deleteWorklog = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.WORKLOG}/${id}`);
};

// * COORDINATOR only: approve or reject a worklog entry
export const updateWorklogStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<void> => {
  await api.patch(`${ENDPOINTS.WORKLOG}/${id}/status`, { status });
};

export const updateWorklog = async (id: string, worklogData: Partial<UpdateWorkLogDTO>): Promise<WorkLog> => {
  const response = await api.put(`${ENDPOINTS.WORKLOG}/${id}`, worklogData);
  return response.data;
};
