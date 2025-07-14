import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompanyFeedPostApi } from "../post.api";
import type { CreateCompanyFeedPostRequest, CompanyFeedPostResponse } from "../post.interface";

export function useCreateCompanyFeedPost() {
  const queryClient = useQueryClient();
  return useMutation<CompanyFeedPostResponse, Error, CreateCompanyFeedPostRequest>({
    mutationFn: createCompanyFeedPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyFeedPosts"] });
    },
  });
} 