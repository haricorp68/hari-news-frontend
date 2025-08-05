import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  isMuted: boolean;
  mutedAt?: string;
  created_at: string;
  updated_at: string;
  follower?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  following?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

// API Response Types
export type ToggleFollowResponse = APIResponse<
  { message: string; isFollowing: boolean },
  undefined
>;
export type GetFollowersResponse = APIResponse<
  Follow[],
  PaginationMetadata | undefined
>;
export type GetFollowingResponse = APIResponse<
  Follow[],
  PaginationMetadata | undefined
>;
export type GetFollowStatsResponse = APIResponse<FollowStats, undefined>;

// Request Types
export interface GetFollowersParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface GetFollowingParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export interface FollowStatusCheck {
  isFollowing: boolean;
  follow?: Follow;
}

export type CheckFollowStatusResponse = APIResponse<
  FollowStatusCheck,
  undefined
>;
