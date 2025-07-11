import { useQuery } from "@tanstack/react-query";
import { getCompanyFeedPostsApi } from "../post.api";

export function useCompanyFeedPosts(companyId: number, enabled = true) {
  return useQuery({
    queryKey: ["companyFeedPosts", companyId],
    queryFn: () => getCompanyFeedPostsApi(companyId).then(res => res.data),
    enabled,
  });
} 