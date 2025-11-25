import { api } from "./client";
import type { CreateSpacePayload, Space } from "@app-types/index";

export const listSpaces = async (): Promise<Space[]> => {
  const { data } = await api.get<Space[]>("/spaces");
  return data;
};

export const createSpace = async (payload: CreateSpacePayload): Promise<Space> => {
  const { data } = await api.post<Space>("/spaces", payload);
  return data;
};

export const joinSpace = async (code: string): Promise<Space> => {
  const { data } = await api.post<Space>(`/spaces/join/${code}`);
  return data;
};

export const getSpace = async (spaceId: number): Promise<Space> => {
  const { data } = await api.get<Space>(`/spaces/${spaceId}`);
  return data;
};

