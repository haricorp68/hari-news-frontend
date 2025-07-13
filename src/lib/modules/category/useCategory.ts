import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategoriesApi,
  getRootCategoriesApi,
  getCategoryByIdApi,
  getChildCategoriesApi,
  searchCategoriesApi,
  autocompleteCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "./category.api";
import type {
  FindAllCategoriesResponse,
  FindRootCategoriesResponse,
  FindCategoryResponse,
  FindChildCategoriesResponse,
  SearchCategoriesResponse,
  AutocompleteCategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SearchCategoriesParams,
  AutocompleteCategoriesParams,
} from "./category.interface";

interface UseCategoryOptions {
  enabledRoot?: boolean;
  enabledDetail?: boolean;
}

export function useCategory(categoryId?: string, options?: UseCategoryOptions) {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách tất cả categories (không dùng mặc định)
  // const categoriesQuery = useQuery<FindAllCategoriesResponse, Error>({
  //   queryKey: ["categories"],
  //   queryFn: getAllCategoriesApi,
  // });

  // 2. Lấy categories gốc
  const rootCategoriesQuery = useQuery<FindRootCategoriesResponse, Error>({
    queryKey: ["categories", "root"],
    queryFn: getRootCategoriesApi,
    enabled: options?.enabledRoot,
  });

  // 3. Lấy chi tiết category theo id (nếu có categoryId)
  const categoryDetailQuery = useQuery<FindCategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryByIdApi(categoryId!),
    enabled: !!categoryId && (options?.enabledDetail ?? true),
  });

  // 4. Lấy categories con
  const childCategoriesQuery = useQuery<FindChildCategoriesResponse, Error>({
    queryKey: ["categories", "children", categoryId],
    queryFn: () => getChildCategoriesApi(categoryId!),
    enabled: !!categoryId,
  });

  // 5. Tìm kiếm categories
  const searchCategoriesMutation = useMutation<SearchCategoriesResponse, Error, SearchCategoriesParams>({
    mutationFn: (params: SearchCategoriesParams) => searchCategoriesApi(params),
  });

  // 6. Gợi ý autocomplete
  const autocompleteCategoriesMutation = useMutation<AutocompleteCategoriesResponse, Error, AutocompleteCategoriesParams>({
    mutationFn: (params: AutocompleteCategoriesParams) => autocompleteCategoriesApi(params),
  });

  // 7. Tạo category mới
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
    },
  });

  // 8. Cập nhật category
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      updateCategoryApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      queryClient.invalidateQueries({ queryKey: ["categories", "children", id] });
    },
  });

  // 9. Xóa category
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "root"] });
    },
  });

  return {
    // Queries
    // categories: categoriesQuery.data?.data,
    // categoriesLoading: categoriesQuery.isLoading,
    rootCategories: rootCategoriesQuery.data?.data,
    rootCategoriesLoading: rootCategoriesQuery.isLoading,
    category: categoryDetailQuery.data?.data,
    categoryLoading: categoryDetailQuery.isLoading,
    childCategories: childCategoriesQuery.data?.data,
    childCategoriesLoading: childCategoriesQuery.isLoading,
    
    // Mutations
    searchCategories: searchCategoriesMutation.mutate,
    searchCategoriesLoading: searchCategoriesMutation.isPending,
    searchCategoriesData: searchCategoriesMutation.data?.data,
    
    autocompleteCategories: autocompleteCategoriesMutation.mutate,
    autocompleteCategoriesLoading: autocompleteCategoriesMutation.isPending,
    autocompleteCategoriesData: autocompleteCategoriesMutation.data?.data,
    
    createCategory: createCategoryMutation.mutate,
    createCategoryLoading: createCategoryMutation.isPending,
    
    updateCategory: updateCategoryMutation.mutate,
    updateCategoryLoading: updateCategoryMutation.isPending,
    
    deleteCategory: deleteCategoryMutation.mutate,
    deleteCategoryLoading: deleteCategoryMutation.isPending,
    
    // Refetch functions
    refetchRootCategories: rootCategoriesQuery.refetch,
    refetchCategory: categoryDetailQuery.refetch,
    refetchChildCategories: childCategoriesQuery.refetch,
  };
} 