import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export interface SpaceMember {
    user_id: number;
    name: string;
    email: string | null;
    avatar_url: string | null;
    role: "member" | "organizer" | "mentor";
    joined_at: string;
}

export const useMembers = (spaceId: number) => {
    return useQuery({
        queryKey: ["spaces", spaceId, "members"],
        queryFn: async () => {
            const { data } = await api.get<SpaceMember[]>(`/spaces/${spaceId}/members`);
            return data;
        },
        refetchInterval: 10000, // Auto-refresh every 10 seconds (pseudo real-time)
    });
};

export const useRemoveMember = (spaceId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: number) => {
            await api.delete(`/spaces/${spaceId}/members/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "members"] });
        },
    });
};

export const useUpdateMemberRole = (spaceId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
            await api.patch(`/spaces/${spaceId}/members/${userId}`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "members"] });
        },
    });
};
