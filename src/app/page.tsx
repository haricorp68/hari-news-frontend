"use client";

import { PostFeedList } from "@/components/post/PostFeedList";
import { useAuthStore } from "@/lib/modules/auth/auth.store";
import { useMainFeedPosts } from "@/lib/modules/post/hooks/useMainFeedPosts";

export default function Home() {
  const { profile } = useAuthStore();
  const userId = profile?.id || "";
  const {
    posts,
    postsLoading,
    error,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  } = useMainFeedPosts(userId);

  return (
    <div className="max-w-2xl mx-auto py-8 grid gap-6">
      <PostFeedList
        posts={posts}
        loading={postsLoading}
        error={error?.message}
      />
      {hasNextPage && (
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => loadMore()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Đang tải thêm..." : "Tải thêm"}
        </button>
      )}
    </div>
  );
}
