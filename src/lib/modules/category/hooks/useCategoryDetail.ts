import { useQuery } from "@tanstack/react-query";
import { getCategoryByIdApi } from "../category.api";
import type { FindCategoryResponse } from "../category.interface";

export function useCategoryDetail(categoryId?: string, enabled: boolean = true) {
  const query = useQuery<FindCategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryByIdApi(categoryId!),
    enabled: !!categoryId && enabled,
  });
  return {
    category: query.data?.data,
    categoryLoading: query.isLoading,
    refetchCategory: query.refetch,
  };
} 