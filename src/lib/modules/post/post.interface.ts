export interface UserFeedPostMedia {
  url: string;
  type: string;
  order: number;
}

export interface UserFeedPostUser {
  name: string;
  avatar: string;
}

export interface UserFeedPost {
  id: number;
  caption: string;
  created_at: string;
  updated_at: string;
  media: UserFeedPostMedia[];
  user: UserFeedPostUser;
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
