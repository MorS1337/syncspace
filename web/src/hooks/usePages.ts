import { useMutation, useQuery } from "@tanstack/react-query";
import { createPage, getPage, listPagesBySpace, updatePage } from "@api/pages";
import type { Page, UpdatePagePayload } from "@app-types/index";
import { queryClient } from "@utils/queryClient";

const pagesKey = (spaceId: number) => ["pages", spaceId];
const pageKey = (pageId?: number) => ["page", pageId];

export const usePages = (spaceId: number, activePageId?: number) => {
  const listQuery = useQuery<Page[], Error>({
    queryKey: pagesKey(spaceId),
    queryFn: () => listPagesBySpace(spaceId),
    enabled: Number.isFinite(spaceId)
  });

  const pageQuery = useQuery<Page, Error>({
    queryKey: pageKey(activePageId),
    queryFn: () => getPage(activePageId!),
    enabled: !!activePageId
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => createPage({ space_id: spaceId, title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pagesKey(spaceId) })
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePagePayload) => updatePage(activePageId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKey(spaceId) });
      queryClient.invalidateQueries({ queryKey: pageKey(activePageId) });
    }
  });

  return {
    pagesQuery: listQuery,
    pageQuery,
    createPage: createMutation.mutateAsync,
    updatePage: updateMutation.mutateAsync,
    saving: updateMutation.isPending
  };
};

