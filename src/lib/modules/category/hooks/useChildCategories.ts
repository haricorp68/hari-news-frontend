import { useQuery } from "@tanstack/react-query";
import { getChildCategoriesApi } from "../category.api";
import type { FindChildCategoriesResponse } from "../category.interface";

export function useChildCategories(parentId?: string, enabled: boolean = true) {
  const query = useQuery<FindChildCategoriesResponse, Error>({
    queryKey: ["categories", "children", parentId],
    queryFn: () => getChildCategoriesApi(parentId!),
    enabled: !!parentId && enabled,
  });
  return {
    childCategories: query.data?.data,
    childCategoriesLoading: query.isLoading,
    refetchChildCategories: query.refetch,
  };
} 