"use client";

import Image from "next/image";

interface ProfileCoverProps {
  coverImage?: string | null;
}

export function ProfileCover({ coverImage }: ProfileCoverProps) {
  if (!coverImage) return null;
  return (
    <div className="w-full h-40 md:h-60 bg-muted mb-0">
      <Image
        src={coverImage}
        alt="Cover"
        className="w-full h-full object-cover"
        width={160}
        height={160}
      />
    </div>
  );
}
