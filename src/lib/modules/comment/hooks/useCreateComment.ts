import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentApi } from "../comment.api";
import type {
  CreateCommentRequest,
  CommentResponse,
} from "../comment.interface";

export function useCreateComment() {
  const queryClient = useQueryClient();
  const mutation = useMutation<CommentResponse, Error, CreateCommentRequest>({
    mutationFn: (data: CreateCommentRequest) => createCommentApi(data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
    },
  });
  return {
    createComment: mutation.mutate,
    createCommentLoading: mutation.isPending,
    createCommentError: mutation.error,
  };
}
