import { useQuery } from "@tanstack/react-query";
import { getUserFeedPostDetailApi } from "../post.api";
import type { UserFeedPost } from "../post.interface";

export function useUserFeedPostDetail(postId: string | number, enabled = true) {
  return useQuery<UserFeedPost, Error>({
    queryKey: ["userFeedPostDetail", postId],
    queryFn: async () => {
      const res = await getUserFeedPostDetailApi(postId);
      return res.data;
    },
    enabled: !!postId && enabled,
  });
} 