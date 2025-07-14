import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserFeedPostApi } from "../post.api";
import type { CreateUserFeedPostRequest, UserFeedPostResponse } from "../post.interface";

export function useCreateUserFeedPost() {
  const queryClient = useQueryClient();
  return useMutation<UserFeedPostResponse, Error, CreateUserFeedPostRequest>({
    mutationFn: createUserFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFeedPosts"] });
    },
  });
}
