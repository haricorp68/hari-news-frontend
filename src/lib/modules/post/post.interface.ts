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
