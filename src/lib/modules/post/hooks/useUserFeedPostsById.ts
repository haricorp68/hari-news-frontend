import { useQuery } from "@tanstack/react-query";
import { getUserFeedPostsApi } from "../post.api";
import type { UserFeedPostListResponse } from "../post.interface";

export function useUserFeedPostsById(userId: string, enabled: boolean = true) {
  return useQuery<UserFeedPostListResponse, Error>({
    queryKey: ["userFeedPosts", userId],
    queryFn: () => getUserFeedPostsApi({ userId }),
    enabled: !!userId && enabled,
  });
} 