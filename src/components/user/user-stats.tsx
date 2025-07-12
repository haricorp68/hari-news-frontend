"use client"

import { User } from "@/lib/modules/user/user.interface"
import { cn } from "@/lib/utils"
import { Users, UserPlus } from "lucide-react"

interface UserStatsProps {
  user: User
  className?: string
  showIcons?: boolean
  onClickFollowers?: () => void
  onClickFollowing?: () => void
}

export function UserStats({ 
  user, 
  className, 
  showIcons = true,
  onClickFollowers,
  onClickFollowing
}: UserStatsProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div 
        className={cn(
          "flex items-center gap-2",
          onClickFollowers && "cursor-pointer hover:text-primary transition-colors"
        )}
        onClick={onClickFollowers}
      >
        {showIcons && <Users className="h-4 w-4" />}
        <div className="text-center">
          <div className="font-semibold text-lg">{user.followersCount}</div>
          <div className="text-xs text-muted-foreground">Người theo dõi</div>
        </div>
      </div>

      <div 
        className={cn(
          "flex items-center gap-2",
          onClickFollowing && "cursor-pointer hover:text-primary transition-colors"
        )}
        onClick={onClickFollowing}
      >
        {showIcons && <UserPlus className="h-4 w-4" />}
        <div className="text-center">
          <div className="font-semibold text-lg">{user.followingCount}</div>
          <div className="text-xs text-muted-foreground">Đang theo dõi</div>
        </div>
      </div>
    </div>
  )
} 