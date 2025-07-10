import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSelfUserFeedPostsApi,
  createUserFeedPostApi,
} from "../post.api";

export function useUserFeedPosts() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["userFeedPosts"],
    queryFn: () => getSelfUserFeedPostsApi().then(res => res.data),
  });
  const createMutation = useMutation({
    mutationFn: createUserFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFeedPosts"] });
    },
  });
  return {
    posts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createUserFeedPost: createMutation.mutate,
    createLoading: createMutation.isPending,
  };
} 