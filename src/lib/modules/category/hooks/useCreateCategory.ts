import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi } from "../category.api";
import type { CreateCategoryRequest, CreateCategoryResponse } from "../category.interface";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation<CreateCategoryResponse, Error, CreateCategoryRequest>({
    mutationFn: (data: CreateCategoryRequest) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
    },
  });
  return {
    createCategory: mutation.mutate,
    createCategoryLoading: mutation.isPending,
  };
} 