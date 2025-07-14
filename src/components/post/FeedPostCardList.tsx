import React from "react";
import FeedPostCard from "./FeedPostCard";
import type { UserFeedPost } from "@/lib/modules/post/post.interface";

interface FeedPostCardListProps {
  posts: UserFeedPost[];
  loading?: boolean;
  error?: string | null;
  onPostClick?: (post: UserFeedPost) => void;
  className?: string;
}

const FeedPostCardList: React.FC<FeedPostCardListProps> = ({
  posts,
  loading = false,
  error = null,
  onPostClick,
  className = "",
}) => {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-full aspect-[4/5] rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 text-lg font-medium mb-2">
          Đã có lỗi xảy ra
        </div>
        <div className="text-gray-600 text-sm">{error}</div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-500 text-lg font-medium mb-2">
          Chưa có bài viết nào
        </div>
        <div className="text-gray-400 text-sm">
          Hãy là người đầu tiên đăng bài nhé!
        </div>
      </div>
    );
  }

  // Handle post click
  const handlePostClick = (post: UserFeedPost) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handlePostClick(post)}
          >
            <FeedPostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPostCardList;
