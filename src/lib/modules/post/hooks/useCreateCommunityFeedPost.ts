import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunityFeedPostApi } from "../post.api";
import type { CreateCommunityFeedPostRequest, CommunityFeedPostResponse } from "../post.interface";

export function useCreateCommunityFeedPost() {
  const queryClient = useQueryClient();
  return useMutation<CommunityFeedPostResponse, Error, CreateCommunityFeedPostRequest>({
    mutationFn: createCommunityFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityFeedPosts"] });
    },
  });
} 