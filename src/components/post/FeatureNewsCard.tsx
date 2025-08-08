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

interface FeaturedNewsCardProps {
  post: UserNewsPostSummary;
}

function getTotalReactions(summary: Record<string, number | undefined>) {
  if (!summary || Object.keys(summary).length === 0) return 0;
  return Object.values(summary).reduce((acc: number, v) => acc + (v || 0), 0);
}

export function FeaturedNewsCard({ post }: FeaturedNewsCardProps) {
  const hasReactions =
    post.reactionSummary && Object.keys(post.reactionSummary).length > 0;
  return (
    <Link href={`/news/${post.slug}`} className="block">
      <Card className="w-full overflow-hidden p-0 shadow-none cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-y-[-4px]">
        <div className="relative w-full aspect-video block group">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover h-full w-full group-hover:brightness-95 transition"
            style={{ objectFit: "cover" }}
          />
          <Badge className="absolute top-4 left-4 z-10 text-base font-semibold px-3 py-1">
            {post.category.name}
          </Badge>
        </div>
        <CardContent className="w-full flex flex-col justify-between py-5 px-6">
          <div>
            <div className="flex items-center gap-2 mb-3 min-w-0 w-full">
              <UserProfileLink user={post.user} avatarOnly>
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={post.user.avatar || undefined}
                    alt={post.user.name}
                  />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
              </UserProfileLink>
              <UserProfileLink
                user={post.user}
                className="text-base font-medium text-gray-800 hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {post.user.name}
              </UserProfileLink>
              <div className="flex-1" />
              <span className="text-sm text-gray-500 whitespace-nowrap flex flex-col items-end leading-tight">
                <span>{formatFullTime(post.created_at).split(" ")[1]}</span>
                <span>{formatFullTime(post.created_at).split(" ")[0]}</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:underline">
              {post.title}
            </h2>
            <p className="text-gray-600 text-base mb-4 line-clamp-3">
              {post.summary}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag.name}
                    variant="outline"
                    className="text-sm font-normal px-2.5 py-1"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex-1 flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                {hasReactions ? (
                  <>
                    <ReactionIcons
                      reactions={Object.keys(post.reactionSummary) as any}
                      className="mr-1"
                    />
                    <span>
                      {getTotalReactions(post.reactionSummary as any)}
                    </span>
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
              className="ml-auto p-2 rounded hover:bg-gray-100 text-gray-500"
              title="Chia sẻ bài viết"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
