import { useQuery } from "@tanstack/react-query";
import { getCommunityFeedPostsApi } from "../post.api";
import type { CommunityFeedPostListResponse } from "../post.interface";

export function useCommunityFeedPosts(communityId: number, enabled = true) {
  return useQuery<CommunityFeedPostListResponse, Error>({
    queryKey: ["communityFeedPosts", communityId],
    queryFn: () => getCommunityFeedPostsApi(communityId),
    enabled,
  });
} 