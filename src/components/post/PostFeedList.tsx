import { PostFeedItem } from "@/components/post/PostFeedItem";
import type { UserFeedPost } from "@/lib/modules/post/post.interface";

interface PostFeedListProps {
  posts: UserFeedPost[];
  loading?: boolean;
  error?: string | null;
  onPostClick?: (post: UserFeedPost) => void;
  className?: string;
}

export function PostFeedList({
  posts,
  loading = false,
  error = null,
  className = "",
}: PostFeedListProps) {
  const LoadingSkeleton = () => (
    <div className="w-full aspect-[4/5] rounded-lg bg-gray-200 animate-pulse"></div>
  );
  // Loading state
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingSkeleton />
      </div>
    );
  }

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

  return (
    <div className="flex flex-col items-center w-full">
      {posts.map((post) => (
        <div key={post.id} className="w-full max-w-2xl mb-6 last:mb-0">
          <PostFeedItem post={post} />
        </div>
      ))}
    </div>
  );
}
