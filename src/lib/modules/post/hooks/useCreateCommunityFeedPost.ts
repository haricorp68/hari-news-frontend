import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunityFeedPostApi } from "../post.api";

export function useCreateCommunityFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommunityFeedPostApi,
    onSuccess: (data, variables) => {
      // variables.communityId phải được truyền vào khi gọi mutation
      if (variables && variables.communityId) {
        queryClient.invalidateQueries({ queryKey: ["communityFeedPosts", variables.communityId] });
      }
    },
  });
} 