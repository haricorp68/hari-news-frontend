import { useMutation } from "@tanstack/react-query";
import { searchCategoriesApi } from "../category.api";
import type { SearchCategoriesResponse, SearchCategoriesParams } from "../category.interface";

export function useSearchCategories() {
  const mutation = useMutation<SearchCategoriesResponse, Error, SearchCategoriesParams>({
    mutationFn: (params: SearchCategoriesParams) => searchCategoriesApi(params),
  });
  return {
    searchCategories: mutation.mutate,
    searchCategoriesLoading: mutation.isPending,
    searchCategoriesData: mutation.data?.data,
  };
} 