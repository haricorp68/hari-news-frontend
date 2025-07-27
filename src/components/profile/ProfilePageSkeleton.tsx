"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="w-full h-40 md:h-60 bg-muted mb-0" />
      <div className="flex flex-col md:flex-row md:items-center md:gap-12 gap-6 py-8 px-4 border-b bg-white">
        <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
        <div className="flex-1 flex flex-col gap-4">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="px-4 mt-8">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
