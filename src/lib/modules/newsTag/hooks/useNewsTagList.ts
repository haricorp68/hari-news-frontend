import { useQuery } from "@tanstack/react-query";
import { getAllTagsApi } from "../newsTag.api";
import { APIResponse, PaginationMetadata } from "@/lib/types/api-response";
import { NewsTag } from "../newsTag.interface";

export function useNewsTagList() {
  const query = useQuery<
    APIResponse<NewsTag[], PaginationMetadata | undefined>,
    Error
  >({
    queryKey: ["newsTags"],
    queryFn: () => getAllTagsApi(),
  });
  return {
    tags: query.data?.data,
    tagsLoading: query.isLoading,
    refetchTags: query.refetch,
    error: query.error,
    metadata: query.data?.metadata,
  };
}
