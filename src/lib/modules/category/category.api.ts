import { getApi, postApi, putApi, deleteApi } from "@/lib/api/api";
import type { 
  Category, 
  FindAllCategoriesResponse,
  FindRootCategoriesResponse,
  FindCategoryResponse,
  FindChildCategoriesResponse,
  SearchCategoriesResponse,
  AutocompleteCategoriesResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SearchCategoriesParams,
  AutocompleteCategoriesParams
} from "./category.interface";

// 1. Lấy tất cả categories
export async function getAllCategoriesApi(): Promise<FindAllCategoriesResponse> {
  return getApi<Category[]>("/categories");
}

// 2. Lấy categories gốc
export async function getRootCategoriesApi(): Promise<FindRootCategoriesResponse> {
  return getApi<Category[]>("/categories/root");
}

// 3. Lấy category theo ID
export async function getCategoryByIdApi(id: string): Promise<FindCategoryResponse> {
  return getApi<Category>(`/categories/${id}`);
}

// 4. Lấy categories con
export async function getChildCategoriesApi(parentId: string): Promise<FindChildCategoriesResponse> {
  return getApi<Category[]>(`/categories/parent/${parentId}`);
}

// 5. Tìm kiếm categories
export async function searchCategoriesApi(params: SearchCategoriesParams): Promise<SearchCategoriesResponse> {
  const searchParams = new URLSearchParams({ name: params.name });
  return getApi<Category[]>(`/categories/search?${searchParams.toString()}`);
}

// 6. Gợi ý autocomplete
export async function autocompleteCategoriesApi(params: AutocompleteCategoriesParams): Promise<AutocompleteCategoriesResponse> {
  const searchParams = new URLSearchParams({ q: params.q });
  return getApi<Category[]>(`/categories/autocomplete?${searchParams.toString()}`);
}

// 7. Tạo category mới
export async function createCategoryApi(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
  return postApi<Category>("/categories", data);
}

// 8. Cập nhật category
export async function updateCategoryApi(id: string, data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> {
  return putApi<Category>(`/categories/${id}`, data);
}

// 9. Xóa category
export async function deleteCategoryApi(id: string): Promise<DeleteCategoryResponse> {
  return deleteApi<{ message: string }>(`/categories/${id}`);
} 