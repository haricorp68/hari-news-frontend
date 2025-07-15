import { postApi, getApi } from "@/lib/api/api";
import type {
  ReactionToggleRequest,
  ReactionToggleResponse,
  ReactionListResponse
} from "./reaction.interface";

// Toggle reaction (like/dislike,...) for a post
export async function toggleReactionApi(
  body: ReactionToggleRequest
): Promise<ReactionToggleResponse> {
  return postApi("/reaction/toggle", body);
}

// Get all reactions and summary for a post
export async function getReactionsByPostIdApi(
  postId: string
): Promise<ReactionListResponse> {
  return getApi(`/reaction/post/${postId}`);
} 