"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PostStatsBar } from "./PostStatsBar";
import { UserFeedPost } from "@/lib/modules/post/post.interface";
import { PostCommentDialog } from "./PostCommentDialog";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import { PostReactButton } from "./PostReactButton";

export function PostFeedItem({ post }: { post: UserFeedPost }) {
  const [showComments, setShowComments] = useState(false);
  const [showReacts, setShowReacts] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

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
        <UserProfileLink user={post.user} avatarOnly className="" />
        <div>
          <UserProfileLink
            user={post.user}
            className="font-semibold text-base p-0 m-0 leading-tight hover:underline cursor-pointer"
          />
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
        <PostStatsBar
          reactionSummary={post.reactionSummary}
          commentCount={post.commentCount}
        />
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
          <PostReactButton
            postId={post.id}
            userReaction={post.userReaction ?? "none"}
            showReacts={showReacts}
            handleReactMouseEnter={handleReactMouseEnter}
            handleReactMouseLeave={handleReactMouseLeave}
          />
          {/* Comment */}
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 justify-center rounded"
            onClick={() => setShowComments(true)}
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
        {/* Dialog bình luận */}
        <PostCommentDialog
          post={post}
          open={showComments}
          onOpenChange={setShowComments}
        />
      </CardFooter>
    </Card>
  );
}
