import { useMutation } from "@tanstack/react-query";
import { searchNewsTagApi } from "../newsTag.api";
import { APIResponse } from "@/lib/types/api-response";
import { NewsTag } from "../newsTag.interface";

export function useSearchNewsTag() {
  const mutation = useMutation<APIResponse<NewsTag>, Error, string>({
    mutationFn: (params: string) => searchNewsTagApi(params),
  });
  return {
    searchNewsTag: mutation.mutate,
    searchNewsTagLoading: mutation.isPending,
    searchNewsTagData: mutation.data?.data,
  };
}
