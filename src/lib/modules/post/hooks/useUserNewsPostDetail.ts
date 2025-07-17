import { useQuery } from "@tanstack/react-query";
import { getUserNewsPostDetailApi } from "../post.api";
import type { UserNewsPostResponse } from "../post.interface";

export function useUserNewsPostDetail(postId: string, enabled = true) {
  return useQuery<UserNewsPostResponse, Error>({
    queryKey: ["userNewsPostDetail", postId],
    queryFn: () => getUserNewsPostDetailApi(postId),
    enabled,
  });
} 