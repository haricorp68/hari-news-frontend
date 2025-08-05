import { getApi, postApi } from "@/lib/api/api";
import type {
  ToggleFollowResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetFollowStatsResponse,
  GetFollowersParams,
  GetFollowingParams,
  FollowStats,
  Follow,
  CheckFollowStatusResponse,
  FollowStatusCheck,
} from "./follow.interface";

// 1. Toggle follow/unfollow
export async function toggleFollowApi(
  followingId: string
): Promise<ToggleFollowResponse> {
  return postApi<{ message: string; isFollowing: boolean }>(
    `/follows/toggle/${followingId}`,
    {}
  );
}

// 2. Lấy danh sách followers
export async function getFollowersApi(
  params: GetFollowersParams
): Promise<GetFollowersResponse> {
  const { userId, page = 1, pageSize = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return getApi<Follow[]>(
    `/follows/followers/${userId}?${searchParams.toString()}`
  );
}

// 3. Lấy danh sách following
export async function getFollowingApi(
  params: GetFollowingParams
): Promise<GetFollowingResponse> {
  const { userId, page = 1, pageSize = 10 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return getApi<Follow[]>(
    `/follows/following/${userId}?${searchParams.toString()}`
  );
}

// 4. Lấy thống kê follow
export async function getFollowStatsApi(
  userId: string
): Promise<GetFollowStatsResponse> {
  return getApi<FollowStats>(`/follows/stats/${userId}`);
}

export async function checkFollowStatusApi(
  userId: string
): Promise<CheckFollowStatusResponse> {
  return getApi<FollowStatusCheck>(`/follows/check/${userId}`);
}
