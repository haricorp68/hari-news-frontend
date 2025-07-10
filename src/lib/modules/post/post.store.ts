import { create } from "zustand";
import type {
  UserFeedPost,
  CommunityFeedPost,
  CompanyFeedPost,
} from "./post.interface";

interface PostState {
  userFeedPosts: UserFeedPost[];
  communityFeedPosts: CommunityFeedPost[];
  companyFeedPosts: CompanyFeedPost[];
  setUserFeedPosts: (posts: UserFeedPost[]) => void;
  setCommunityFeedPosts: (posts: CommunityFeedPost[]) => void;
  setCompanyFeedPosts: (posts: CompanyFeedPost[]) => void;
  clearAllPosts: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  userFeedPosts: [],
  communityFeedPosts: [],
  companyFeedPosts: [],
  setUserFeedPosts: (posts) => set({ userFeedPosts: posts }),
  setCommunityFeedPosts: (posts) => set({ communityFeedPosts: posts }),
  setCompanyFeedPosts: (posts) => set({ companyFeedPosts: posts }),
  clearAllPosts: () =>
    set({
      userFeedPosts: [],
      communityFeedPosts: [],
      companyFeedPosts: [],
    }),
}));
