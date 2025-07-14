"use client"

import { Plus } from "lucide-react";
import Image from "next/image";

interface Story {
  id: string;
  image: string;
  label: string;
}

interface ProfileStoriesProps {
  stories?: Story[];
  isOwnProfile: boolean;
}

export function ProfileStories({ stories = [], isOwnProfile }: ProfileStoriesProps) {
  return (
    <div className="flex gap-4 px-4 py-6 overflow-x-auto scrollbar-hide">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 min-w-[72px]">
          <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center">
            <Image
              src={story.image}
              alt={story.label}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs mt-1 truncate max-w-[64px]">{story.label}</span>
        </div>
      ))}
      {isOwnProfile && (
        <button className="flex flex-col items-center gap-1 min-w-[72px] group focus:outline-none">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center bg-muted group-hover:bg-primary/10 transition">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs mt-1 text-primary">Mới</span>
        </button>
      )}
    </div>
  );
} 