import { useMutation } from "@tanstack/react-query";
import { autocompleteCategoriesApi } from "../category.api";
import type { AutocompleteCategoriesResponse, AutocompleteCategoriesParams } from "../category.interface";

export function useAutocompleteCategories() {
  const mutation = useMutation<AutocompleteCategoriesResponse, Error, AutocompleteCategoriesParams>({
    mutationFn: (params: AutocompleteCategoriesParams) => autocompleteCategoriesApi(params),
  });
  return {
    autocompleteCategories: mutation.mutate,
    autocompleteCategoriesLoading: mutation.isPending,
    autocompleteCategoriesData: mutation.data?.data,
  };
} 