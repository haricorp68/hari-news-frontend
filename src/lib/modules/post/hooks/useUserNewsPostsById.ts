import { useQuery } from "@tanstack/react-query";
import { getUserNewsPostsApi } from "../post.api";
import type { UserNewsPostSummaryListResponse } from "../post.interface";

export function useUserNewsPostsById(userId: string, enabled = true) {
  return useQuery<UserNewsPostSummaryListResponse, Error>({
    queryKey: ["userNewsPosts", userId],
    queryFn: () => getUserNewsPostsApi(userId),
    enabled,
  });
} 