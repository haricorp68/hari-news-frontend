"use client";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

export function CardSkeleton() {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image skeleton - left side */}
        <Skeleton className="relative w-full md:w-2/5 aspect-video md:aspect-auto md:h-64 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />

        {/* Content skeleton - right side */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          {/* Header with avatar and info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Avatar skeleton */}
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
              {/* Author name skeleton */}
              <Skeleton className="h-5 w-24 md:w-32 rounded-md" />
            </div>
            {/* Date skeleton */}
            <div className="text-right flex flex-col gap-1">
              <Skeleton className="h-4 w-16 md:w-20 rounded-md" />
              <Skeleton className="h-4 w-12 md:w-16 rounded-md" />
            </div>
          </div>

          {/* Title skeleton */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-6 md:h-7 w-4/5 rounded-md" />
            <Skeleton className="h-6 md:h-7 w-3/5 rounded-md" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>

          {/* Tags and actions skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {/* Tags skeleton */}
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-12 rounded-full" />
            </div>

            {/* Reactions and actions skeleton */}
            <div className="flex items-center space-x-4">
              {/* Reactions skeleton */}
              <Skeleton className="w-12 h-6 rounded-full" />
              <Skeleton className="w-10 h-6 rounded-full" />
              {/* Share button skeleton */}
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
