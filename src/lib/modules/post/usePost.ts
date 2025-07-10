import { useUserFeedPosts } from "./hooks/useUserFeedPosts";
import { useCommunityFeedPosts } from "./hooks/useCommunityFeedPosts";
import { useCompanyFeedPosts } from "./hooks/useCompanyFeedPosts";
import { usePostStore } from "./post.store";

export function usePost() {
  const clearAllPosts = usePostStore((s) => s.clearAllPosts);
  return {
    useUserFeedPosts,
    useCommunityFeedPosts,
    useCompanyFeedPosts,
    clearAllPosts,
  };
} 