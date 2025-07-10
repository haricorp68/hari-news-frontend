"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Angry,
  Frown,
  Meh,
} from "lucide-react";
import { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";

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
  { type: "haha", icon: <Laugh className="text-yellow-500" />, label: "Haha" },
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

export function PostFeedItem({ post }: { post: any }) {
  const [showComments, setShowComments] = useState(false);
  const [showReacts, setShowReacts] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const reactCounts = post.reacts || {
    like: 0,
    dislike: 0,
    love: 0,
    haha: 0,
    angry: 0,
    sad: 0,
    meh: 0,
  };
  const totalReacts = (Object.values(reactCounts) as number[]).reduce(
    (a, b) => a + b,
    0
  );

  // Hover logic for react button
  const handleReactMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    hoverTimeout.current = setTimeout(() => setShowReacts(true), 500);
  };
  const handleReactMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => setShowReacts(false), 500);
  };

  return (
    <div className="bg-card rounded-xl shadow p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Avatar>
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{post.user.name}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleString()}
          </div>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Sao chép liên kết</DropdownMenuItem>
              <DropdownMenuItem>Báo cáo</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Caption */}
      <div className="mb-2">{post.caption}</div>
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-2 grid grid-cols-1 gap-2">
          {post.media.map((m: any, idx: number) =>
            m.type.startsWith("image") ? (
              <img
                key={idx}
                src={m.url}
                alt=""
                className="rounded-lg max-h-80 object-cover w-full"
              />
            ) : (
              <video
                key={idx}
                src={m.url}
                controls
                className="rounded-lg max-h-80 w-full"
              />
            )
          )}
        </div>
      )}
      {/* Số react, comment, share */}
      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
        <span>{totalReacts} cảm xúc</span>
        <span>{post.commentCount || 0} bình luận</span>
        <span>{post.shareCount || 0} chia sẻ</span>
      </div>
      {/* Khung bình luận (giả lập) */}
      {showComments && (
        <div className="mt-3 border-t pt-2">
          <div className="text-sm text-muted-foreground">
            Bình luận sẽ hiển thị ở đây...
          </div>
        </div>
      )}
      {/* Separator và các nút bấm */}
      <Separator className="my-1" />
      <div className="flex w-full">
        {/* Reacts */}
        <div
          className="relative flex-1"
          onMouseEnter={handleReactMouseEnter}
          onMouseLeave={handleReactMouseLeave}
        >
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-center flex-1 rounded "
          >
            <ThumbsUp className=" h-5 w-5" /> Thích
          </Button>
          {/* React popup */}
          {showReacts && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-1 bg-background border rounded-xl shadow-lg p-2 z-10 animate-in fade-in">
              {REACTS.map((r) => (
                <Button
                  key={r.type}
                  variant="ghost"
                  size="icon"
                  title={r.label}
                >
                  {r.icon}
                </Button>
              ))}
            </div>
          )}
        </div>
        {/* Comment */}
        <Button
          variant="ghost"
          size="lg"
          className="flex-1 justify-center rounded"
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageCircle className=" h-5 w-5" /> Bình luận
        </Button>
        {/* Share */}
        <Button
          variant="ghost"
          size="lg"
          className="flex-1 justify-center rounded"
        >
          <Share2 className=" h-5 w-5" /> Chia sẻ
        </Button>
      </div>
    </div>
  );
}
