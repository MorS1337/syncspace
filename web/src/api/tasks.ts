import { api } from "./client";
import type {
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from "@app-types/index";

export const listTasksBySpace = async (
  spaceId: number,
  status?: TaskStatus
): Promise<Task[]> => {
  const params = status ? { status } : undefined;
  const { data } = await api.get<Task[]>(`/tasks/by-space/${spaceId}`, {
    params
  });
  return data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
};

export const updateTask = async (
  taskId: number,
  payload: UpdateTaskPayload
): Promise<Task> => {
  const { data } = await api.patch<Task>(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

