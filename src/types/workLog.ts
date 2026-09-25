import { ActivityTask } from "./activity";

// Interface principal
export interface WorkLog {
  id: string;
  weekStart: string;
  hours: number;
  notes: string;
  status?: string;
  activityTitle?: string;
  activity: ActivityTask | null;
}

export interface CreateWorkLogDTO{
  weekStart: string;
  hours: number;
  notes: string;
  activity: ActivityTask | null;
}

export type UpdateWorkLogDTO = Partial<CreateWorkLogDTO>


export interface WorkLogReponse{
    worklog: WorkLog[];
}
