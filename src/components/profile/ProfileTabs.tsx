"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Newspaper } from "lucide-react";
import FeedPostCardList from "@/components/post/FeedPostCardList";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
import { useUserFeedPostsById } from "@/lib/modules/post/hooks/useUserFeedPostsById";
import { useUserNewsPostsById } from "@/lib/modules/post/hooks/useUserNewsPostsById";

export function ProfileTabs({ userId }: { userId: string }) {
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
          <ProfileNewsGrid userId={userId} />
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

function ProfileNewsGrid({ userId }: { userId: string }) {
  // Sử dụng hook lấy news của user theo userId
  const { data, isLoading } = useUserNewsPostsById(userId);
  const newsPosts = data?.data || [];
  return (
    <NewsSummaryCardList
      posts={newsPosts}
      loading={isLoading}
      className="mt-4"
    />
  );
}
