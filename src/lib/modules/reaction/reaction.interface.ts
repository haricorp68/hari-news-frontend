import type { APIResponse } from "@/lib/types/api-response";
import { ReactionType } from "../post/post.interface";

// Request body for /reaction/toggle
export interface ReactionToggleRequest {
  type: string; // e.g., 'like'
  postId: string;
}

// Data object in response
export interface ReactionData {
  id: string;
  type: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Full response from /reaction/toggle
export type ReactionToggleResponse = APIResponse<ReactionData, undefined>;

export type ReactionSummary = {
  [K in ReactionType]?: number;
};

export interface ReactionListData {
  reactions: ReactionData[];
  summary: ReactionSummary;
}

export type ReactionListResponse = APIResponse<ReactionListData, undefined>;
