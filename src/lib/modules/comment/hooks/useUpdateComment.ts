import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentApi } from "../comment.api";
import type { UpdateCommentRequest, CommentResponse } from "../comment.interface";

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const mutation = useMutation<CommentResponse, Error, { id: string; data: UpdateCommentRequest }>({
    mutationFn: ({ id, data }) => updateCommentApi(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", res.data?.postId] });
    },
  });
  return {
    updateComment: mutation.mutate,
    updateCommentLoading: mutation.isPending,
    updateCommentError: mutation.error,
  };
} 