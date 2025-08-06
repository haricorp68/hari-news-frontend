import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNewsPostApi } from "../post.api";
import { toast } from "sonner";

export function useDeleteUserNewsPost() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: deleteNewsPostApi,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["userNewsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userNewsPostDetail"] });
    },
  });
}
