import { useQuery } from "@tanstack/react-query";
import { getSelfUserFeedPostsApi } from "../post.api";

export function useUserFeedPosts(enabled = true) {
  return useQuery({
    queryKey: ["userFeedPosts"],
    queryFn: () => getSelfUserFeedPostsApi().then(res => res.data),
    enabled,
  });
} 