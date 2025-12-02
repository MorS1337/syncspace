import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@api/client";

export type Tag = {
    id: number;
    space_id: number;
    name: string;
    color: string;
};

type CreateTagPayload = {
    space_id: number;
    name: string;
    color?: string;
};

export const useTags = (spaceId: number) => {
    const queryClient = useQueryClient();

    const tagsQuery = useQuery({
        queryKey: ["tags", spaceId],
        queryFn: async () => {
            const response = await api.get<Tag[]>(`/tags/space/${spaceId}`);
            return response.data;
        },
        enabled: !!spaceId,
    });

    const createTag = useMutation({
        mutationFn: async (payload: CreateTagPayload) => {
            const response = await api.post<Tag>("/tags/", payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags", spaceId] });
        },
    });

    const deleteTag = useMutation({
        mutationFn: async (tagId: number) => {
            await api.delete(`/tags/${tagId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags", spaceId] });
        },
    });

    return {
        tagsQuery,
        createTag: createTag.mutateAsync,
        deleteTag: deleteTag.mutateAsync,
    };
};
