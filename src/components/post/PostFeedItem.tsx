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
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ReactionIcons, { ReactionType } from "@/components/ui/reaction-icons";
import Link from "next/link";
import { UserFeedPost } from "@/lib/modules/post/post.interface";

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

export function PostFeedItem({ post }: { post: UserFeedPost }) {
  const [showComments, setShowComments] = useState(false);
  const [showReacts, setShowReacts] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const reactCounts = post.reactionSummary || {};

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
    <Card className="mb-8 max-w-2xl mx-auto gap-0">
      <CardHeader className="flex flex-row items-center gap-4 mb-0 pb-0 border-b-0">
        <Link
          href={`/${post.user.id}`}
          prefetch={false}
          className="cursor-pointer"
        >
          <Avatar>
            <AvatarImage
              src={post.user.avatar || undefined}
              alt={post.user.name}
            />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <CardTitle className="font-semibold text-base p-0 m-0 leading-tight">
            {post.user.name}
          </CardTitle>
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
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <div className="mb-4 text-lg font-medium">{post.caption}</div>
        {post.media && post.media.length > 0 && (
          <div className="mb-4">
            {post.media.length === 1 &&
              (post.media[0].type.startsWith("image") ? (
                <Image
                  src={post.media[0].url}
                  alt=""
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full aspect-video"
                />
              ) : (
                <video
                  src={post.media[0].url}
                  controls
                  className="rounded-lg object-cover w-full aspect-video"
                />
              ))}
            {post.media.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.media
                  .slice(0, 2)
                  .map((m: any, idx: number) =>
                    m.type.startsWith("image") ? (
                      <Image
                        key={idx}
                        src={m.url}
                        alt=""
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full aspect-video"
                      />
                    ) : (
                      <video
                        key={idx}
                        src={m.url}
                        controls
                        className="rounded-lg object-cover w-full aspect-video"
                      />
                    )
                  )}
              </div>
            )}
            {post.media.length === 3 && (
              <div className="grid grid-cols-3 gap-2 h-96">
                {/* Ảnh/video đầu chiếm 2/3 chiều rộng, full height */}
                <div className="col-span-2 h-full">
                  {post.media[0].type.startsWith("image") ? (
                    <Image
                      src={post.media[0].url}
                      alt=""
                      width={400}
                      height={384}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  ) : (
                    <video
                      src={post.media[0].url}
                      controls
                      className="rounded-lg object-cover w-full h-full"
                    />
                  )}
                </div>
                {/* 2 ảnh/video còn lại xếp dọc bên phải */}
                <div className="flex flex-col gap-2 h-full">
                  {[post.media[1], post.media[2]].map((m: any, idx: number) =>
                    m.type.startsWith("image") ? (
                      <Image
                        key={idx}
                        src={m.url}
                        alt=""
                        width={200}
                        height={188}
                        className="rounded-lg object-cover w-full h-1/2 min-h-0"
                        style={{ height: "calc(50% - 0.25rem)" }}
                      />
                    ) : (
                      <video
                        key={idx}
                        src={m.url}
                        controls
                        className="rounded-lg object-cover w-full h-1/2 min-h-0"
                        style={{ height: "calc(50% - 0.25rem)" }}
                      />
                    )
                  )}
                </div>
              </div>
            )}
            {post.media.length === 4 && (
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-96">
                {post.media.map((m: any, idx: number) =>
                  m.type.startsWith("image") ? (
                    <Image
                      key={idx}
                      src={m.url}
                      alt=""
                      width={300}
                      height={192}
                      className="rounded-lg object-cover w-full h-full min-h-0"
                    />
                  ) : (
                    <video
                      key={idx}
                      src={m.url}
                      controls
                      className="rounded-lg object-cover w-full h-full min-h-0"
                    />
                  )
                )}
              </div>
            )}
            {/* Layout mới cho 5 ảnh trở lên */}
            {post.media.length >= 5 && (
              <div className="h-96 flex flex-col gap-2">
                {/* Phần trên: 60% chiều cao, 2 ảnh đầu */}
                <div className="flex-[3] grid grid-cols-2 gap-2">
                  {post.media
                    .slice(0, 2)
                    .map((m: any, idx: number) =>
                      m.type.startsWith("image") ? (
                        <Image
                          key={idx}
                          src={m.url}
                          alt=""
                          width={300}
                          height={230}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      ) : (
                        <video
                          key={idx}
                          src={m.url}
                          controls
                          className="rounded-lg object-cover w-full h-full"
                        />
                      )
                    )}
                </div>
                {/* Phần dưới: 40% chiều cao, 3 ảnh tiếp theo */}
                <div className="flex-[2] grid grid-cols-3 gap-2">
                  {post.media.slice(2, 5).map((m: any, idx: number) => (
                    <div key={idx} className="relative">
                      {m.type.startsWith("image") ? (
                        <Image
                          src={m.url}
                          alt=""
                          width={200}
                          height={150}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      ) : (
                        <video
                          src={m.url}
                          controls
                          className="rounded-lg object-cover w-full h-full"
                        />
                      )}
                      {/* Overlay số ảnh còn lại cho ảnh cuối */}
                      {idx === 2 && post.media.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                          <span className="text-white text-xl font-bold">
                            +{post.media.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-4 text-xs text-muted-foreground mb-1 items-center justify-between">
          {/* Hiển thị các icon cảm xúc đã được sử dụng */}
          {Object.values(reactCounts).some((v) => v && v > 0) && (
            <span className="flex items-center">
              <ReactionIcons
                reactions={
                  Object.entries(reactCounts)
                    .filter((entry) => entry[1] && entry[1] > 0)
                    .map((entry) => entry[0]) as ReactionType[]
                }
              />
              <span className="ml-1 font-medium text-xs text-foreground">
                {Object.values(reactCounts).reduce(
                  (a, b) => (a || 0) + (b || 0),
                  0
                )}
              </span>
            </span>
          )}
          <span className="flex-1"></span>
          <span className="text-right min-w-fit">
            {post.commentCount || 0} bình luận
          </span>
          {/* Bỏ shareCount vì không có trong interface */}
        </div>
        {showComments && (
          <div className="mt-3 border-t pt-2">
            <div className="text-sm text-muted-foreground">
              Bình luận sẽ hiển thị ở đây...
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col px-0 pt-0">
        <Separator className="my-3" />
        <div className="flex w-full px-6">
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
      </CardFooter>
    </Card>
  );
}
