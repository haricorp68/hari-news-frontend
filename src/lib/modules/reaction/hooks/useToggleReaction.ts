import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleReactionApi } from "../reaction.api";
import type {
  ReactionToggleRequest,
  ReactionToggleResponse,
} from "../reaction.interface";

export function useToggleReaction(
  options?: Parameters<
    typeof useMutation<ReactionToggleResponse, Error, ReactionToggleRequest>
  >[0]
) {
  const queryClient = useQueryClient();
  return useMutation<ReactionToggleResponse, Error, ReactionToggleRequest>({
    mutationFn: toggleReactionApi,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["mainFeedPosts"] });
    },
    ...options,
  });
}
