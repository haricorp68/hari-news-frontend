import { useQuery } from "@tanstack/react-query";
import { getRepliesByParentIdApi } from "../comment.api";
import type { CommentListResponse } from "../comment.interface";

export function useRepliesByParentId(parentId?: string, enabled: boolean = true, page: number = 1, pageSize: number = 10) {
  const query = useQuery<CommentListResponse, Error>({
    queryKey: ["replies", parentId, page, pageSize],
    queryFn: () => getRepliesByParentIdApi(parentId!, { page, pageSize }),
    enabled: !!parentId && enabled,
  });
  return {
    replies: query.data?.data,
    meta: (query.data as any)?.meta,
    repliesLoading: query.isLoading,
    refetchReplies: query.refetch,
    error: query.error,
  };
} 