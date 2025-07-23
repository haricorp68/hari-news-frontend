import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getNewsPostsApi } from "../post.api";
import type {
  GetNewsPostsParams,
  UserNewsPostSummaryListResponse,
} from "../post.interface";

export function useNewsPosts(params: GetNewsPostsParams = {}, enabled = true) {
  const query = useQuery<UserNewsPostSummaryListResponse, Error>({
    queryKey: ["newsPosts", params],
    queryFn: () => getNewsPostsApi(params),
    enabled,
    placeholderData: keepPreviousData,
  });
  return {
    posts: query.data?.data,
    postsLoading: query.isLoading,
    refreshPosts: query.refetch,
  };
}
