import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserNewsPostsApi } from "../post.api";
import type { UserNewsPostSummaryListResponse } from "../post.interface";

export function useUserNewsPostsById(userId: string, enabled = true) {
  const query = useInfiniteQuery<UserNewsPostSummaryListResponse, Error>({
    queryKey: ["userNewsPosts", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserNewsPostsApi(userId, pageParam as number),
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

    // Backward compatibility - keep the old interface
    data: query.data?.pages[0], // For components that still expect this structure
    isLoading: query.isLoading,
  };
}
