import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNewsPostApi } from "../post.api";

export function useDeleteUserNewsPost() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: deleteNewsPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userNewsPostDetail"] });
    },
  });
}
