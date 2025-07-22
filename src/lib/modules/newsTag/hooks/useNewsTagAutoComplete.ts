import { APIResponse, PaginationMetadata } from "@/lib/types/api-response";
import { useMutation } from "@tanstack/react-query";
import { NewsTag } from "../newsTag.interface";
import { autocompleteNewsTagApi } from "../newsTag.api";

export function useAutocompleteNewsTags() {
  const mutation = useMutation<
    APIResponse<NewsTag[], PaginationMetadata | undefined>,
    Error,
    string
  >({
    mutationFn: (params: string) => autocompleteNewsTagApi(params),
  });
  return {
    autocompleteNewsTags: mutation.mutate,
    autocompleteNewsTagsLoading: mutation.isPending,
    autocompleteNewsTagsData: mutation.data?.data,
  };
}
