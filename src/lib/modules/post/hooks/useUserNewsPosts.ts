import { useQuery } from "@tanstack/react-query";
import { getSelfUserNewsPostsApi } from "../post.api";
import type { UserNewsPostSummaryListResponse } from "../post.interface";

export function useUserNewsPosts(enabled = true) {
  return useQuery<UserNewsPostSummaryListResponse, Error>({
    queryKey: ["userNewsPosts", "self"],
    queryFn: getSelfUserNewsPostsApi,
    enabled,
  });
} 