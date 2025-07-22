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
import { NewsTag } from "../newsTag/newsTag.interface";

// User News Post
export interface UserNewsPostCategory {
  id: string;
  name: string;
  description: string;
}

export enum UserNewsPostBlockType {
  Text = "text",
  Image = "image",
  Video = "video",
  File = "file",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
}

export interface UserNewsPostBlock {
  id: string;
  type: UserNewsPostBlockType;
  content: string;
  media_url: string | null;
  file_name: string | null;
  file_size: number | null;
  order: number;
}

export interface CreateUserNewsPostBlockRequest {
  type:
    | "text"
    | "image"
    | "video"
    | "file"
    | "heading_1"
    | "heading_2"
    | "heading_3";
  content: string;
  media_url?: string;
  file_name?: string;
  file_size?: number;
  order: number;
}

export interface CreateUserNewsPostRequest {
  title: string;
  summary: string;
  cover_image: string;
  blocks: CreateUserNewsPostBlockRequest[];
  categoryId: string;
  tags: string[];
}

export interface UserNewsPost {
  id: string;
  title: string;
  summary: string;
  cover_image: string;
  category: UserNewsPostCategory;
  created_at: string;
  updated_at: string;
  user: UserFeedPostUser;
  blocks: UserNewsPostBlock[];
  reactionSummary: ReactionSummary;
  commentCount: number;
  userReaction?: ReactionType;
  tags: NewsTag[];
}

export interface UserNewsPostSummary {
  id: string;
  title: string;
  summary: string;
  cover_image: string;
  category: UserNewsPostCategory;
  created_at: string;
  updated_at: string;
  user: UserFeedPostUser;
  reactionSummary: ReactionSummary;
  commentCount: number;
  tags?: NewsTag[];
}

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

export type UserNewsPostSummaryListResponse = APIResponse<
  UserNewsPostSummary[],
  undefined
>;

export type UserNewsPostResponse = APIResponse<UserNewsPost, undefined>;
