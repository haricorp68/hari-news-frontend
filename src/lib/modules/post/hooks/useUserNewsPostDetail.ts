import { useQuery } from "@tanstack/react-query";
import { getUserNewsPostDetailApi } from "../post.api";
import type { UserNewsPostResponse } from "../post.interface";

export function useUserNewsPostDetail(postId?: string, enabled: boolean = true) {
  const query = useQuery<UserNewsPostResponse, Error>({
    queryKey: ["userNewsPostDetail", postId],
    queryFn: () => getUserNewsPostDetailApi(postId!),
    enabled: !!postId && enabled,
  });
  return {
    post: query.data?.data,
    postLoading: query.isLoading,
    refetchPost: query.refetch,
  };
}
