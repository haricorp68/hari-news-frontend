import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi } from "../comment.api";
import type { DeleteCommentResponse } from "../comment.interface";

export function useDeleteComment(postId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteCommentResponse, Error, string>({
    mutationFn: (commentId: string) => deleteCommentApi(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
  return {
    deleteComment: mutation.mutate,
    deleteCommentLoading: mutation.isPending,
    deleteCommentError: mutation.error,
  };
} 