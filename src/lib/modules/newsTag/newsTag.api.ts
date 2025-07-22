import { APIResponse } from "@/lib/types/api-response";
import { NewsTag } from "./newsTag.interface";
import { getApi } from "@/lib/api/api";

export async function getAllTagsApi(): Promise<APIResponse<NewsTag[]>> {
  return getApi<NewsTag[]>("/news-tags");
}

export async function autocompleteNewsTagApi(
  params: string
): Promise<APIResponse<NewsTag[]>> {
  const searchParams = new URLSearchParams({ q: params });
  return getApi<NewsTag[]>(
    `/news-tags/autocomplete?${searchParams.toString()}`
  );
}

export async function searchNewsTagApi(
  params: string
): Promise<APIResponse<NewsTag>> {
  const searchParams = new URLSearchParams({ q: params });
  return getApi<NewsTag>(`/news-tags/search?${searchParams.toString()}`);
}
