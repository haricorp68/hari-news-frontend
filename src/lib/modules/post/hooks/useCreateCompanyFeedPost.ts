import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanyFeedPostApi } from "../post.api";

export function useCreateCompanyFeedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompanyFeedPostApi,
    onSuccess: (data, variables) => {
      // variables.companyId phải được truyền vào khi gọi mutation
      if (variables && variables.companyId) {
        queryClient.invalidateQueries({ queryKey: ["companyFeedPosts", variables.companyId] });
      }
    },
  });
} 