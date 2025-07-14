import { useQuery } from "@tanstack/react-query";
import { getSelfUserFeedPostsApi } from "../post.api";
import type { UserFeedPostListResponse } from "../post.interface";

export function useUserFeedPosts(enabled = true) {
  return useQuery<UserFeedPostListResponse, Error>({
    queryKey: ["userFeedPosts"],
    queryFn: () => getSelfUserFeedPostsApi(),
    enabled,
  });
} 