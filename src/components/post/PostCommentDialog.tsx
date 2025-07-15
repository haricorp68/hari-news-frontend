import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCommentList } from "@/lib/modules/comment/hooks/useCommentList";
import { useCreateComment } from "@/lib/modules/comment/hooks/useCreateComment";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import { UserFeedPost } from "@/lib/modules/post/post.interface";
import { PostStatsBar } from "./PostFeedItem";
import { PostReactButton } from "./PostReactButton";
import { useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Angry,
  Frown,
  Meh,
} from "lucide-react";
import { CommentList } from "@/components/ui/comment-list";
import { formatFullTime } from "@/utils/formatTime";

interface PostCommentDialogProps {
  post: UserFeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostCommentDialog({
  post,

  open,
  onOpenChange,
}: PostCommentDialogProps) {
  console.log(
    "🔍 ~ PostCommentDialog ~ src/components/post/PostCommentDialog.tsx:38 ~ post:",
    post
  );
  const { comments, commentsLoading } = useCommentList(post.id, open);
  const { createComment, createCommentLoading } = useCreateComment();
  const [content, setContent] = useState("");
  // React popup state riêng cho dialog
  const [showReacts, setShowReacts] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const REACTS = [
    {
      type: "like",
      icon: <ThumbsUp className="text-blue-500" />,
      label: "Thích",
    },
    {
      type: "dislike",
      icon: <ThumbsDown className="text-gray-500" />,
      label: "Không thích",
    },
    {
      type: "love",
      icon: <Heart className="text-red-500" />,
      label: "Yêu thích",
    },
    {
      type: "haha",
      icon: <Laugh className="text-yellow-500" />,
      label: "Haha",
    },
    {
      type: "angry",
      icon: <Angry className="text-orange-500" />,
      label: "Phẫn nộ",
    },
    { type: "sad", icon: <Frown className="text-blue-400" />, label: "Buồn" },
    {
      type: "meh",
      icon: <Meh className="text-gray-400" />,
      label: "Bình thường",
    },
  ];
  const handleReactMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    hoverTimeout.current = setTimeout(() => setShowReacts(true), 500);
  };
  const handleReactMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => setShowReacts(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    //mark
    createComment({ postId: post.id, content });
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-5xl h-[80vh] md:h-[90vh] min-h-[400px] p-0 overflow-hidden border-0 flex flex-col">
        <div className="flex flex-col md:flex-row w-full h-full flex-1">
          {/* Left: Media (5.5/10) */}
          <div className="md:flex-[5.5] md:bg-black flex items-center justify-center min-w-0 relative w-full md:w-auto bg-black">
            {post.media && post.media.length > 0 ? (
              <Carousel className="w-full h-full flex items-center justify-center">
                <CarouselContent className="h-full">
                  {post.media.map((m, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex items-center justify-center h-full"
                    >
                      {m.type.startsWith("image") ? (
                        <Image
                          src={m.url}
                          alt="media"
                          width={800}
                          height={600}
                          className="object-contain max-h-[40vh] md:max-h-[75vh] max-w-full rounded-lg bg-black"
                        />
                      ) : (
                        <video
                          src={m.url}
                          controls
                          className="object-contain max-h-[40vh] md:max-h-[75vh] max-w-full rounded-lg bg-black"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 z-10" />
                <CarouselNext className="right-2 z-10" />
              </Carousel>
            ) : (
              <span className="text-muted-foreground">Không có media</span>
            )}
          </div>
          {/* Right: Bình luận (4.5/10) */}
          <div className="md:flex-[4.5] flex flex-col h-full min-h-0 min-w-0 w-full md:w-auto">
            {/* Header: Avatar + tên người dùng cùng hàng ngang */}
            <div className="flex flex-row items-center gap-3 border-b py-4 px-4 flex-shrink-0">
              <UserProfileLink
                user={post.user}
                avatarOnly
                className="flex items-center"
              />
              <UserProfileLink
                user={post.user}
                className="font-semibold text-base hover:underline cursor-pointer"
              />
            </div>

            {/* Comment List (scrollable) - ĐÂY LÀ PHẦN QUAN TRỌNG */}
            <div
              className="flex-1 overflow-y-auto overflow-x-auto px-4 py-2"
              style={{ height: 0 }}
            >
              {commentsLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Đang tải bình luận...
                </div>
              ) : comments && comments.length > 0 ? (
                <CommentList comments={comments} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Chưa có bình luận nào.
                </div>
              )}
            </div>

            {/* Chức năng: caption, stats, form nhập bình luận */}
            <div className="px-4 py-2 border-t flex-shrink-0">
              {/* Post Content */}
              {post.caption && (
                <div className="">
                  <span className="text-sm">{post.caption}</span>
                </div>
              )}

              {/* Post Date */}
              <div className="text-xs text-muted-foreground mb-2">
                {post.created_at
                  ? formatFullTime(post.created_at)
                  : ""}
              </div>
              {/* Post Stats Bar */}
              <PostStatsBar
                reactionSummary={post.reactionSummary}
                commentCount={post.commentCount}
              />
              <form
                onSubmit={handleSubmit}
                className="pt-2 flex gap-2 items-end flex-row"
              >
                <PostReactButton
                  showReacts={showReacts}
                  handleReactMouseEnter={handleReactMouseEnter}
                  handleReactMouseLeave={handleReactMouseLeave}
                  REACTS={REACTS}
                  className="border rounded w-auto min-w-0"
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 min-h-10 max-w-md max-h-2"
                  rows={1}
                  disabled={createCommentLoading}
                />
                <Button
                  type="submit"
                  disabled={createCommentLoading || !content.trim()}
                >
                  Đăng
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
