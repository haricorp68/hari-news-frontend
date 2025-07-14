"use client"

import { User } from "@/lib/modules/user/user.interface"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import Image from "next/image";

interface UserCoverImageProps {
  user: User
  className?: string
  height?: "sm" | "md" | "lg"
}

const heightClasses = {
  sm: "h-32",
  md: "h-48",
  lg: "h-64"
}

export function UserCoverImage({ user, className, height = "md" }: UserCoverImageProps) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg", heightClasses[height], className)}>
      {user.coverImage ? (
        <Image
          src={user.coverImage}
          alt={`${user.name}'s cover image`}
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">No cover image</span>
          </div>
        </div>
      )}
    </div>
  )
} 