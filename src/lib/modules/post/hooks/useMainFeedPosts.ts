import { useInfiniteQuery } from "@tanstack/react-query";
import { getMainFeedPostsApi } from "../post.api";
import type { UserFeedPost } from "../post.interface";
import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export function useMainFeedPosts(
  userId: string,
  enabled = true,
  pageSize: number = 10
) {
  const query = useInfiniteQuery<
    APIResponse<UserFeedPost[], PaginationMetadata | undefined>,
    Error
  >({
    queryKey: ["mainFeedPosts", userId, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getMainFeedPostsApi(userId, pageParam as number, pageSize),
    enabled,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.metadata;
      if (!meta) return undefined;
      const currentPage = meta.page || 1;
      const totalPages = meta.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
