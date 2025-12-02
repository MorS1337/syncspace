import { api } from "./client";
import type { CreatePagePayload, Page, UpdatePagePayload } from "@app-types/index";

export const listPagesBySpace = async (spaceId: number): Promise<Page[]> => {
  const { data } = await api.get<Page[]>(`/pages/by-space/${spaceId}`);
  return data;
};

export const createPage = async (payload: CreatePagePayload): Promise<Page> => {
  const { data } = await api.post<Page>("/pages", payload);
  return data;
};

export const getPage = async (pageId: number): Promise<Page> => {
  const { data } = await api.get<Page>(`/pages/${pageId}`);
  return data;
};

export const updatePage = async (
  pageId: number,
  payload: UpdatePagePayload
): Promise<Page> => {
  const { data } = await api.put<Page>(`/pages/${pageId}`, payload);
  return data;
};

export const deletePage = async (pageId: number): Promise<void> => {
  await api.delete(`/pages/${pageId}`);
};

