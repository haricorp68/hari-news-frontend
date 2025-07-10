import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyFeedPostsApi,
  createCompanyFeedPostApi,
} from "../post.api";

export function useCompanyFeedPosts(companyId: number) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["companyFeedPosts", companyId],
    queryFn: () => getCompanyFeedPostsApi(companyId).then(res => res.data),
  });
  const createMutation = useMutation({
    mutationFn: createCompanyFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyFeedPosts", companyId] });
    },
  });
  return {
    posts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createCompanyFeedPost: createMutation.mutate,
    createLoading: createMutation.isPending,
  };
} 