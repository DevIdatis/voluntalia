import { useQuery } from "@tanstack/react-query";
import { getWorkLogsForUser } from "@/services/workLogService";
import { WorkLog } from "@/types/workLog";

// * COORDINATOR only: fetch another user's worklog entries, only when needed
export const useWorkLogsForUser = (userId: string | undefined, enabled: boolean) => {
  return useQuery<WorkLog[], Error>({
    queryKey: ["worklog", "user", userId],
    queryFn: () => getWorkLogsForUser(userId as string),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60,
  });
};
