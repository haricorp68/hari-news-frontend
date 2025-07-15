import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface CommentMedia {
  url: string;
  type: string;
}

export interface CommentUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  postType: PostType;
  content: string;
  user: CommentUser;
  parentId: string | null;
  media: CommentMedia[];
  created_at: string;
  updated_at: string;
  childCount: number;
}

// ==== API RESPONSE & REQUEST TYPES ====

export interface CreateCommentRequest {
  postType: string;
  postId: string;
  content: string;
  parentId?: string;
  media?: CommentMedia[];
}

export interface UpdateCommentRequest {
  content: string;
}

export type DeleteCommentResponse = APIResponse<{ message: string }, undefined>;

export type CommentResponse = APIResponse<Comment, undefined>;
export type CommentListResponse = APIResponse<
  Comment[],
  PaginationMetadata | undefined
>;

export enum PostType {
  USER_FEED = "user_feed",
  COMMUNITY_FEED = "community_feed",
  COMPANY_FEED = "company_feed",
  USER_NEWS = "user_news",
  COMMUNITY_NEWS = "community_news",
  COMPANY_NEWS = "company_news",
}
