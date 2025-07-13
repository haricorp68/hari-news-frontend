import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi } from "../category.api";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
    },
  });
  return {
    deleteCategory: mutation.mutate,
    deleteCategoryLoading: mutation.isPending,
  };
} 