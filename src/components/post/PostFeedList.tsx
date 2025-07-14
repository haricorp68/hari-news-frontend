import { PostFeedItem } from "@/components/post/PostFeedItem";
import type { UserFeedPost } from "@/lib/modules/post/post.interface";

export function PostFeedList({ posts }: { posts: UserFeedPost[] }) {
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
