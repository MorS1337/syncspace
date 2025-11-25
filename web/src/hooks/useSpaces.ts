import { useMutation, useQuery } from "@tanstack/react-query";
import { createSpace, joinSpace, listSpaces } from "@api/spaces";
import type { CreateSpacePayload, Space } from "@app-types/index";
import { queryClient } from "@utils/queryClient";

const spacesKey = ["spaces"];

export const useSpaces = () => {
  const query = useQuery<Space[], Error>({
    queryKey: spacesKey,
    queryFn: listSpaces
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateSpacePayload) => createSpace(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: spacesKey })
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) => joinSpace(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: spacesKey })
  });

  return {
    spacesQuery: query,
    createSpace: createMutation.mutateAsync,
    createPending: createMutation.isPending,
    joinSpace: joinMutation.mutateAsync,
    joinPending: joinMutation.isPending
  };
};

