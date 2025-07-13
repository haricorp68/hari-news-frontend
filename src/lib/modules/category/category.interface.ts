import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  parentId: string | null;
  created_at: string;
  updated_at: string;
}

// API Response Types
export type FindAllCategoriesResponse = APIResponse<Category[], PaginationMetadata | undefined>;
export type FindRootCategoriesResponse = APIResponse<Category[], undefined>;
export type FindCategoryResponse = APIResponse<Category, undefined>;
export type FindChildCategoriesResponse = APIResponse<Category[], undefined>;
export type SearchCategoriesResponse = APIResponse<Category[], PaginationMetadata | undefined>;
export type AutocompleteCategoriesResponse = APIResponse<Category[], undefined>;
export type CreateCategoryResponse = APIResponse<Category, undefined>;
export type UpdateCategoryResponse = APIResponse<Category, undefined>;
export type DeleteCategoryResponse = APIResponse<{ message: string }, undefined>;

// Request Types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  coverImage?: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  coverImage?: string;
  parentId?: string;
}

export interface SearchCategoriesParams {
  name: string;
}

export interface AutocompleteCategoriesParams {
  q: string;
} 