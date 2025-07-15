import { useMutation } from "@tanstack/react-query";
import { toggleReactionApi } from "../reaction.api";
import type { ReactionToggleRequest, ReactionToggleResponse } from "../reaction.interface";

export function useToggleReaction() {
  return useMutation<ReactionToggleResponse, Error, ReactionToggleRequest>({
    mutationFn: toggleReactionApi,
  });
} 