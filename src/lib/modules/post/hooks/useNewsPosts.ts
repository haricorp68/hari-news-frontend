import { useInfiniteQuery } from "@tanstack/react-query";
import { getNewsPostsApi } from "../post.api";
import type {
  GetNewsPostsParams,
  UserNewsPostSummaryListResponse,
} from "../post.interface";

export function useNewsPosts(params: GetNewsPostsParams = {}, enabled = true) {
  const query = useInfiniteQuery<UserNewsPostSummaryListResponse, Error>({
    queryKey: ["userNewsPosts", params],
    queryFn: ({ pageParam = 1 }) =>
      getNewsPostsApi({ ...params, page: pageParam as number }),
    enabled,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.metadata?.page || 1;
      const totalPages = lastPage.metadata?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Flatten all pages data into a single array
  const allPosts = query.data?.pages.flatMap((page) => page.data) || [];

  return {
    posts: allPosts,
    postsLoading: query.isLoading,
    postsFetching: query.isFetching,
    refreshPosts: query.refetch,
    loadMore: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    page: query.data?.pages[0]?.metadata?.page,
    totalPages: query.data?.pages[0]?.metadata?.totalPages,
    error: query.error,
  };
}
