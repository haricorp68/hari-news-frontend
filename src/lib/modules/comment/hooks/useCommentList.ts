import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostApi } from "../comment.api";
import type { CommentListResponse } from "../comment.interface";

export function useCommentList(postId?: string, enabled: boolean = true, page: number = 1, pageSize: number = 10) {
  const query = useQuery<CommentListResponse, Error>({
    queryKey: ["comments", postId, page, pageSize],
    queryFn: () => getCommentsByPostApi(postId!, { page, pageSize }),
    enabled: !!postId && enabled,
  });
  return {
    comments: query.data?.data,
    meta: (query.data as any)?.meta,
    commentsLoading: query.isLoading,
    refetchComments: query.refetch,
    error: query.error,
  };
} 