import { useCommentList } from "./hooks/useCommentList";
import { useCreateComment } from "./hooks/useCreateComment";
import { useUpdateComment } from "./hooks/useUpdateComment";
import { useDeleteComment } from "./hooks/useDeleteComment";
import { useRepliesByParentId } from "./hooks/useRepliesByParentId";

export function useComment() {
  return {
    useCommentList,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useRepliesByParentId,
  };
} 