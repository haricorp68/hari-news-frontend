import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityFeedPostsApi,
  createCommunityFeedPostApi,
} from "../post.api";

export function useCommunityFeedPosts(communityId: number) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["communityFeedPosts", communityId],
    queryFn: () => getCommunityFeedPostsApi(communityId).then(res => res.data),
  });
  const createMutation = useMutation({
    mutationFn: createCommunityFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityFeedPosts", communityId] });
    },
  });
  return {
    posts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createCommunityFeedPost: createMutation.mutate,
    createLoading: createMutation.isPending,
  };
} 