import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNewsPostApi } from "../post.api";
import type { UpdateNewsPostRequest, UserNewsPost } from "../post.interface";
import type { APIResponse } from "@/lib/types/api-response";
import { toast } from "sonner";

export function useUpdateUserNewsPost() {
  const queryClient = useQueryClient();
  return useMutation<
    APIResponse<UserNewsPost, undefined>,
    Error,
    { postId: string; data: UpdateNewsPostRequest }
  >({
    mutationFn: ({ postId, data }) => updateNewsPostApi(postId, data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userNewsPostDetail"] });
    },
  });
}
