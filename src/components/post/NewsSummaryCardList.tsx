"use client";
import * as React from "react";
import { NewsSummaryCard } from "./NewsSummaryCard";
import type { UserNewsPostSummary } from "@/lib/modules/post/post.interface";
import { CardSkeleton } from "@/components/ui/card-skeleton";

interface NewsSummaryCardListProps {
  posts: UserNewsPostSummary[];
  loading?: boolean;
  className?: string;
}

export function NewsSummaryCardList({ posts, loading = false, className = "" }: NewsSummaryCardListProps) {
  if (loading) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-400 py-8">Không có bài viết nào.</div>;
  }
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {posts.map((post) => (
        <NewsSummaryCard key={post.id} post={post} />
      ))}
    </div>
  );
} 