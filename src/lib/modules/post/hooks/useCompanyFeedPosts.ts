import { useQuery } from "@tanstack/react-query";
import { getCompanyFeedPostsApi } from "../post.api";
import type { CompanyFeedPostListResponse } from "../post.interface";

export function useCompanyFeedPosts(companyId: number, enabled = true) {
  return useQuery<CompanyFeedPostListResponse, Error>({
    queryKey: ["companyFeedPosts", companyId],
    queryFn: () => getCompanyFeedPostsApi(companyId),
    enabled,
  });
} 