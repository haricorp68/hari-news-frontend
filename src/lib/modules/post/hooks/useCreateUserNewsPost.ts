import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserNewsPostApi } from "../post.api";
import type { CreateUserNewsPostRequest, UserNewsPostResponse } from "../post.interface";

export function useCreateUserNewsPost() {
  const queryClient = useQueryClient();
  return useMutation<UserNewsPostResponse, Error, CreateUserNewsPostRequest>({
    mutationFn: createUserNewsPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
    },
  });
} 