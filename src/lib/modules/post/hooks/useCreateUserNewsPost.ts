import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserNewsPostApi } from "../post.api";
import type {
  CreateUserNewsPostRequest,
  UserNewsPostResponse,
} from "../post.interface";
import { toast } from "sonner";

export function useCreateUserNewsPost() {
  const queryClient = useQueryClient();
  return useMutation<UserNewsPostResponse, Error, CreateUserNewsPostRequest>({
    mutationFn: createUserNewsPostApi,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
    },
  });
}
