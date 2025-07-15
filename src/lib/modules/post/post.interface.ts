export type ReactionType =
  | "like"
  | "dislike"
  | "love"
  | "haha"
  | "angry"
  | "sad"
  | "meh";

export interface ReactionSummary {
  like?: number;
  dislike?: number;
  love?: number;
  haha?: number;
  angry?: number;
  sad?: number;
  meh?: number;
}

export interface UserFeedPostMedia {
  url: string;
  type: string;
  order: number;
}

export interface UserFeedPostUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface UserFeedPost {
  id: string;
  caption: string;
  created_at: string;
  updated_at: string;
  media: UserFeedPostMedia[];
  user: UserFeedPostUser;
  reactionSummary: ReactionSummary;
  commentCount: number;
  userReaction?: ReactionType; // loại reaction của user hiện tại, undefined nếu chưa react
}

export interface CommunityFeedPostMedia {
  url: string;
  type: string;
  order: number;
}

export interface CommunityFeedPostCommunity {
  name: string;
  avatar: string;
}

export interface CommunityFeedPost {
  id: number;
  caption: string;
  created_at: string;
  media: CommunityFeedPostMedia[];
  community: CommunityFeedPostCommunity;
}

export interface CompanyFeedPostMedia {
  url: string;
  type: string;
  order: number;
}

export interface CompanyFeedPostCompany {
  name: string;
  avatar: string;
}

export interface CompanyFeedPost {
  id: number;
  caption: string;
  created_at: string;
  media: CompanyFeedPostMedia[];
  company: CompanyFeedPostCompany;
}

// ==== API RESPONSE & REQUEST TYPES ====
import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

// USER FEED
export interface CreateUserFeedPostRequest {
  caption: string;
  media?: { url: string; type: string; order: number }[];
}
export type UserFeedPostListResponse = APIResponse<
  UserFeedPost[],
  PaginationMetadata | undefined
>;
export type UserFeedPostResponse = APIResponse<UserFeedPost, undefined>;

// COMMUNITY FEED
export interface CreateCommunityFeedPostRequest {
  communityId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}
export type CommunityFeedPostListResponse = APIResponse<
  CommunityFeedPost[],
  PaginationMetadata | undefined
>;
export type CommunityFeedPostResponse = APIResponse<
  CommunityFeedPost,
  undefined
>;

// COMPANY FEED
export interface CreateCompanyFeedPostRequest {
  companyId: number;
  caption: string;
  media?: { url: string; type: string; order: number }[];
}
export type CompanyFeedPostListResponse = APIResponse<
  CompanyFeedPost[],
  PaginationMetadata | undefined
>;
export type CompanyFeedPostResponse = APIResponse<CompanyFeedPost, undefined>;
