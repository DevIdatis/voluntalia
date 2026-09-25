import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorklogStatus } from "@/services/workLogService";

export const useUpdateWorklogStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: string; status: "pending" | "approved" | "rejected" }
  >({
    mutationFn: ({ id, status }) => updateWorklogStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worklog"] });
    },
  });
};
