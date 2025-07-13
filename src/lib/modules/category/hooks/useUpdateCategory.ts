import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryApi } from "../category.api";
import type { UpdateCategoryRequest, UpdateCategoryResponse } from "../category.interface";

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation<UpdateCategoryResponse, Error, { id: string; data: UpdateCategoryRequest }>({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      queryClient.invalidateQueries({ queryKey: ["categories", "children", id] });
    },
  });
  return {
    updateCategory: mutation.mutate,
    updateCategoryLoading: mutation.isPending,
  };
} 