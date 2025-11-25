import { useMutation, useQuery } from "@tanstack/react-query";
import { createTask, listTasksBySpace, updateTask } from "@api/tasks";
import type { Task, TaskStatus, UpdateTaskPayload } from "@app-types/index";
import { queryClient } from "@utils/queryClient";

const tasksKey = (spaceId: number, status?: TaskStatus) => ["tasks", spaceId, status];

export const useTasks = (spaceId: number, status?: TaskStatus) => {
  const listQuery = useQuery<Task[], Error>({
    queryKey: tasksKey(spaceId, status),
    queryFn: () => listTasksBySpace(spaceId, status),
    enabled: Number.isFinite(spaceId)
  });

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      createTask({ space_id: spaceId, ...payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey(spaceId) })
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { taskId: number; data: UpdateTaskPayload }) =>
      updateTask(payload.taskId, payload.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKey(spaceId) })
  });

  return {
    tasksQuery: listQuery,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    updating: updateMutation.isPending
  };
};

