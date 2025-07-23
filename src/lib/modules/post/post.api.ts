import { getApi, postApi } from "@/lib/api/api";
import type {
  UserFeedPost,
  CommunityFeedPost,
  CompanyFeedPost,
  CreateUserNewsPostRequest,
  UserNewsPostResponse,
  UserNewsPost,
  UserNewsPostSummaryListResponse,
  UserNewsPostSummary,
  GetNewsPostsParams,
} from "./post.interface";
import type { APIResponse } from "@/lib/types/api-response";

// USER FEED
export async function createUserFeedPostApi(body: {
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<UserFeedPost>> {
  return postApi<UserFeedPost>("/post/user-feed", body);
}

export async function getSelfUserFeedPostsApi(params?: {
  limit?: number;
  offset?: number;
}): Promise<APIResponse<UserFeedPost[]>> {
  return getApi<UserFeedPost[]>("/post/self/user-feed", { params });
}

export async function getSelfUserFeedPostDetailApi(
  id: number
): Promise<APIResponse<UserFeedPost>> {
  return getApi<UserFeedPost>(`/post/self/user-feed/${id}`);
}

export async function getUserFeedPostsApi(params: {
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<APIResponse<UserFeedPost[]>> {
  const { userId, limit, offset } = params;
  const query: Record<string, any> = {};
  if (limit !== undefined) query.limit = limit;
  if (offset !== undefined) query.offset = offset;
  return getApi<UserFeedPost[]>(`/post/user-feed/${userId}`, { params: query });
}

export async function getUserFeedPostDetailApi(id: string | number) {
  return getApi<UserFeedPost>(`/post/user-feed/detail/${id}`);
}

// USER NEWS POST
export async function createUserNewsPostApi(
  body: CreateUserNewsPostRequest
): Promise<UserNewsPostResponse> {
  return postApi<UserNewsPost>("/post/user-news", body);
}

export async function getSelfUserNewsPostsApi(): Promise<UserNewsPostSummaryListResponse> {
  return getApi<UserNewsPostSummary[]>("/post/self/user-news");
}

export async function getUserNewsPostsApi(
  userId: string
): Promise<UserNewsPostSummaryListResponse> {
  return getApi<UserNewsPostSummary[]>(`/post/user-news/${userId}`);
}

export async function getUserNewsPostDetailApi(
  postId: string
): Promise<UserNewsPostResponse> {
  return getApi<UserNewsPost>(`/post/user-news/detail/${postId}`);
}

// COMMUNITY FEED
export async function createCommunityFeedPostApi(body: {
  communityId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<CommunityFeedPost>> {
  return postApi<CommunityFeedPost>("/post/community-feed", body);
}

export async function getCommunityFeedPostsApi(
  communityId: number,
  params?: { limit?: number; offset?: number }
): Promise<APIResponse<CommunityFeedPost[]>> {
  return getApi<CommunityFeedPost[]>(
    `/post/community-feed?communityId=${communityId}`,
    { params }
  );
}

export async function getCommunityFeedPostDetailApi(
  communityId: number,
  id: number
): Promise<APIResponse<CommunityFeedPost>> {
  return getApi<CommunityFeedPost>(
    `/post/community-feed/${id}?communityId=${communityId}`
  );
}

// COMPANY FEED
export async function createCompanyFeedPostApi(body: {
  companyId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}): Promise<APIResponse<CompanyFeedPost>> {
  return postApi<CompanyFeedPost>("/post/company-feed", body);
}

export async function getCompanyFeedPostsApi(
  companyId: number,
  params?: { limit?: number; offset?: number }
): Promise<APIResponse<CompanyFeedPost[]>> {
  return getApi<CompanyFeedPost[]>(
    `/post/company-feed?companyId=${companyId}`,
    { params }
  );
}

export async function getCompanyFeedPostDetailApi(
  companyId: number,
  id: number
): Promise<APIResponse<CompanyFeedPost>> {
  return getApi<CompanyFeedPost>(
    `/post/company-feed/${id}?companyId=${companyId}`
  );
}

export async function getNewsPostsApi(
  params: GetNewsPostsParams = {}
): Promise<UserNewsPostSummaryListResponse> {
  // Xử lý tagIds nếu là mảng
  const queryParams = { ...params };
  if (Array.isArray(queryParams.tagIds)) {
    queryParams.tagIds = queryParams.tagIds.join(",");
  }
  return getApi<UserNewsPostSummary[]>("/post/news", { params: queryParams });
}
