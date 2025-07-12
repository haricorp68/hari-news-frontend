"use client"

import { User } from "@/lib/modules/user/user.interface"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: User
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showName?: boolean
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24"
}

export function UserAvatar({ user, size = "md", className, showName = false }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={cn("rounded-full", sizeClasses[size])}>
        <AvatarImage 
          src={user.avatar || undefined} 
          alt={user.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      )}
    </div>
  )
} 