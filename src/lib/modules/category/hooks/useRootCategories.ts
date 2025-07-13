import { useQuery } from "@tanstack/react-query";
import { getRootCategoriesApi } from "../category.api";
import type { FindRootCategoriesResponse } from "../category.interface";

export function useRootCategories(enabled: boolean = true) {
  const query = useQuery<FindRootCategoriesResponse, Error>({
    queryKey: ["categories", "root"],
    queryFn: getRootCategoriesApi,
    enabled,
  });
  return {
    rootCategories: query.data?.data,
    rootCategoriesLoading: query.isLoading,
    refetchRootCategories: query.refetch,
  };
} 