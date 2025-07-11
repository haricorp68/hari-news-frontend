import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserFeedPostApi } from "../post.api";

export function useCreateUserFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFeedPosts"] });
    },
  });
} 