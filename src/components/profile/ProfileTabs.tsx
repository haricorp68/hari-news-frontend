"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Newspaper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import FeedPostCardList from "@/components/post/FeedPostCardList";
import { NewsEditMode } from "@/components/post/NewsEditMode";
import { useUserFeedPostsById } from "@/lib/modules/post/hooks/useUserFeedPostsById";
import { useUserNewsPostsById } from "@/lib/modules/post/hooks/useUserNewsPostsById";

// Intersection Observer hook for infinite scrolling
function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const [elementRef, setElementRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(elementRef);
    return () => observer.disconnect();
  }, [elementRef, callback, options]);

  return setElementRef;
}

interface ProfileTabsProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileTabs({ userId, isOwnProfile }: ProfileTabsProps) {
  return (
    <div className="px-4">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="flex w-full justify-center gap-2">
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <Grid className="w-4 h-4" />
            Bài viết
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1">
            <Newspaper className="w-4 h-4" />
            News
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <ProfilePostsGrid userId={userId} />
        </TabsContent>
        <TabsContent value="news">
          <ProfileNewsGrid userId={userId} isOwnProfile={isOwnProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfilePostsGrid({ userId }: { userId: string }) {
  // Sử dụng hook lấy bài viết của user theo userId
  const { data, isLoading, error } = useUserFeedPostsById(userId);
  const posts = data?.data || [];
  return (
    <FeedPostCardList
      posts={posts}
      loading={isLoading}
      error={error?.message || null}
    />
  );
}

function ProfileNewsGrid({
  userId,
  isOwnProfile,
}: {
  userId: string;
  isOwnProfile: boolean;
}) {
  // Sử dụng hook lấy news của user theo userId với infinite scrolling
  const {
    posts,
    postsLoading,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    postsFetching,
    refreshPosts,
  } = useUserNewsPostsById(userId);

  // Infinite scroll callback
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver(handleLoadMore, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Refresh handler for after delete
  const handleRefresh = useCallback(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <div className="mt-4">
      <NewsEditMode
        posts={posts || []}
        loading={postsLoading}
        isOwnProfile={isOwnProfile}
        onRefresh={handleRefresh}
      />

      {/* Infinite Scroll Trigger and End of Content Message */}
      {hasNextPage ? (
        <div ref={loadMoreRef} className="flex justify-center py-6">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải thêm bài viết...
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={!hasNextPage}
              className="gap-2"
            >
              Tải thêm bài viết
            </Button>
          )}
        </div>
      ) : (
        // Show end of content message when there are no more pages and posts exist
        posts &&
        posts.length > 0 &&
        !postsLoading && (
          <div className="flex justify-center py-8">
            <div className="text-center text-gray-500">
              <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-4"></div>
              <p className="text-sm font-medium">
                Bạn đã xem hết tất cả bài viết
              </p>
              <p className="text-xs mt-1 text-gray-400">
                Không còn nội dung để hiển thị
              </p>
            </div>
          </div>
        )
      )}

      {/* Loading indicator for background fetching */}
      {postsFetching && !postsLoading && !isFetchingNextPage && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang làm mới...
        </div>
      )}
    </div>
  );
}
