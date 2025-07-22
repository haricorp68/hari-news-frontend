"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import type { UserNewsPostSummary } from "@/lib/modules/post/post.interface";
import Image from "next/image";
import * as React from "react";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import { formatFullTime } from "@/utils/formatTime";
import Link from "next/link";
import ReactionIcons from "../ui/reaction-icons";

interface NewsSummaryCardProps {
  post: UserNewsPostSummary;
}

function getTotalReactions(summary: Record<string, number | undefined>) {
  if (!summary || Object.keys(summary).length === 0) return 0;
  return Object.values(summary).reduce((acc: number, v) => acc + (v || 0), 0);
}

export function NewsSummaryCard({ post }: NewsSummaryCardProps) {
  const hasReactions =
    post.reactionSummary && Object.keys(post.reactionSummary).length > 0;
  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden py-0 shadow-none gap-0">
      {/* Ảnh: trên mobile là trên, md: là trái */}
      <Link
        href={`/news/${post.id}`}
        className="relative w-full md:w-2/5 min-w-[112px] aspect-video md:aspect-auto block group"
        tabIndex={-1}
      >
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover h-full w-full group-hover:brightness-95 transition"
          style={{ objectFit: "cover" }}
        />
        <Badge className="absolute top-2 left-2 z-10">
          {post.category.name}
        </Badge>
      </Link>
      {/* Nội dung: dưới (mobile) hoặc phải (md) */}
      <CardContent className="w-full md:w-3/5 flex flex-col justify-between py-4 px-5">
        <div>
          <div className="flex items-center gap-2 mb-2 min-w-0 w-full">
            <UserProfileLink user={post.user} avatarOnly>
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={post.user.avatar || undefined}
                  alt={post.user.name}
                />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
            </UserProfileLink>
            <UserProfileLink
              user={post.user}
              className="text-sm font-medium text-gray-800 hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {post.user.name}
            </UserProfileLink>
            <div className="flex-1" />
            <span className="text-xs text-gray-500 whitespace-nowrap flex flex-col items-end leading-tight">
              <span>{formatFullTime(post.created_at).split(" ")[1]}</span>
              <span>{formatFullTime(post.created_at).split(" ")[0]}</span>
            </span>
          </div>
          <Link
            href={`/news/${post.id}`}
            className="block w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-1 line-clamp-2 hover:underline">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {post.summary}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant="outline"
                  className="text-xs font-normal px-2 py-0.5"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              {hasReactions ? (
                <>
                  <ReactionIcons
                    reactions={Object.keys(post.reactionSummary) as any}
                    className="mr-1"
                  />
                  <span>{getTotalReactions(post.reactionSummary as any)}</span>
                </>
              ) : (
                <>
                  <ThumbsUp size={16} className="mr-1" />
                  <span>0</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MessageCircle size={16} className="mr-1" />
              {post.commentCount}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-500"
            title="Chia sẻ bài viết"
            onClick={(e) => {
              e.stopPropagation(); /* TODO: share logic */
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
