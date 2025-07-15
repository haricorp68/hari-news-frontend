import React, { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react"; // icon video
import { Heart, MessageCircle } from "lucide-react"; // icon reaction, comment
import type { UserFeedPost } from "@/lib/modules/post/post.interface";
import { PostCommentDialog } from "./PostCommentDialog";
import { useUserFeedPostDetail } from "@/lib/modules/post/hooks/useUserFeedPostDetail";

interface FeedPostCardProps {
  post: UserFeedPost;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString();
}

const FeedPostCard: React.FC<FeedPostCardProps> = ({ post }) => {
  const [showDialog, setShowDialog] = useState(false);
  const firstMedia = post.media[0];
  const isVideo = firstMedia?.type.startsWith("video");

  // Fetch post detail when dialog is open
  const { data: postDetail, refetch } = useUserFeedPostDetail(post.id, showDialog);

  // Tổng số reaction
  const reactionCount = Object.values(post.reactionSummary || {}).reduce(
    (sum, v) => sum + (v || 0),
    0
  );

  return (
    <>
      <div
        className="relative group w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 shadow cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        {/* Thời gian tạo post góc trên trái, chỉ hiện khi hover */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {timeAgo(post.created_at)}
        </div>
        {/* Media hoặc caption */}
        {firstMedia ? (
          isVideo ? (
            <video
              src={firstMedia.url}
              className="object-cover w-full h-full"
              muted
              loop
              playsInline
              preload="metadata"
              poster={firstMedia.url + "?frame=1"} // fallback nếu có
            />
          ) : (
            <Image
              src={firstMedia.url}
              alt="post media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-700 px-4 text-center text-base font-medium">
            {post.caption}
          </div>
        )}

        {/* Icon video góc trên phải */}
        {isVideo && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 z-10">
            <PlayCircle size={24} color="white" />
          </div>
        )}

        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center">
          <div className="flex items-center gap-6 text-white text-lg font-semibold">
            <span className="flex items-center gap-2">
              <Heart size={24} /> {reactionCount}
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle size={24} /> {post.commentCount}
            </span>
          </div>
        </div>
      </div>
      <PostCommentDialog
        post={postDetail || post}
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          if (open) refetch();
        }}
        refetchPostDetail={refetch}
      />
    </>
  );
};

export default FeedPostCard;
