import { useQuery } from "@tanstack/react-query";
import { getCommunityFeedPostsApi } from "../post.api";

export function useCommunityFeedPosts(communityId: number, enabled = true) {
  return useQuery({
    queryKey: ["communityFeedPosts", communityId],
    queryFn: () => getCommunityFeedPostsApi(communityId).then(res => res.data),
    enabled,
  });
} 