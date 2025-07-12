"use client"

import { User } from "@/lib/modules/user/user.interface"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"
import { UserCoverImage } from "./user-cover-image"
import { UserInfo } from "./user-info"
import { UserStats } from "./user-stats"
import { UserActions } from "./user-actions"

interface UserProfileProps {
  user: User
  className?: string
  variant?: "compact" | "full" | "card"
  isOwnProfile?: boolean
  isFollowing?: boolean
  showCoverImage?: boolean
  showStats?: boolean
  showActions?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  onMessage?: () => void
  onEdit?: () => void
  onBlock?: () => void
  onReport?: () => void
  onFollowersClick?: () => void
  onFollowingClick?: () => void
}

export function UserProfile({
  user,
  className,
  variant = "full",
  isOwnProfile = false,
  isFollowing = false,
  showCoverImage = true,
  showStats = true,
  showActions = true,
  onFollow,
  onUnfollow,
  onMessage,
  onEdit,
  onBlock,
  onReport,
  onFollowersClick,
  onFollowingClick
}: UserProfileProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 p-4", className)}>
        <UserAvatar user={user} size="md" showName={true} />
        {showActions && (
          <UserActions
            user={user}
            isFollowing={isFollowing}
            isOwnProfile={isOwnProfile}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            onMessage={onMessage}
            onEdit={onEdit}
            onBlock={onBlock}
            onReport={onReport}
          />
        )}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        {showCoverImage && (
          <UserCoverImage user={user} height="sm" />
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <UserInfo 
                user={user} 
                showEmail={false}
                className="mb-3"
              />
              {showStats && (
                <UserStats 
                  user={user}
                  onClickFollowers={onFollowersClick}
                  onClickFollowing={onFollowingClick}
                />
              )}
            </div>
            {showActions && (
              <UserActions
                user={user}
                isFollowing={isFollowing}
                isOwnProfile={isOwnProfile}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
                onMessage={onMessage}
                onEdit={onEdit}
                onBlock={onBlock}
                onReport={onReport}
              />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full variant
  return (
    <div className={cn("space-y-6", className)}>
      {/* Cover Image */}
      {showCoverImage && (
        <UserCoverImage user={user} height="lg" />
      )}

      {/* Main Profile Section */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <UserAvatar user={user} size="xl" />
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <UserInfo 
                  user={user}
                  showEmail={true}
                  showPhone={false}
                  showLocation={true}
                />
              </div>
              
              {showActions && (
                <UserActions
                  user={user}
                  isFollowing={isFollowing}
                  isOwnProfile={isOwnProfile}
                  onFollow={onFollow}
                  onUnfollow={onUnfollow}
                  onMessage={onMessage}
                  onEdit={onEdit}
                  onBlock={onBlock}
                  onReport={onReport}
                />
              )}
            </div>

            {showStats && (
              <UserStats 
                user={user}
                onClickFollowers={onFollowersClick}
                onClickFollowing={onFollowingClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 