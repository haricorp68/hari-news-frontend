import { useQuery } from "@tanstack/react-query";
import { getReactionsByPostIdApi } from "../reaction.api";
import type { ReactionListResponse } from "../reaction.interface";

export function useReactionsByPostId(postId?: string) {
  return useQuery<ReactionListResponse, Error>({
    queryKey: ["reactions", postId],
    queryFn: () => {
      if (!postId) throw new Error("postId is required");
      return getReactionsByPostIdApi(postId);
    },
    enabled: !!postId,
  });
} 