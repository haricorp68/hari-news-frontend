"use client";

import { User } from "@/lib/modules/user/user.interface";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  MoreHorizontal,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsProps {
  user: User;
  className?: string;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

export function UserActions({
  className,
  isFollowing = false,
  isOwnProfile = false,
  onFollow,
  onUnfollow,
  onMessage,
  onEdit,
  onBlock,
  onReport,
}: UserActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isOwnProfile ? (
        <Button variant="outline" onClick={onEdit}>
          <Settings className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      ) : (
        <>
          {isFollowing ? (
            <Button variant="outline" onClick={onUnfollow}>
              <UserMinus className="h-4 w-4 mr-2" />
              Bỏ theo dõi
            </Button>
          ) : (
            <Button onClick={onFollow}>
              <UserPlus className="h-4 w-4 mr-2" />
              Theo dõi
            </Button>
          )}

          <Button variant="outline" onClick={onMessage}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Nhắn tin
          </Button>
        </>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isOwnProfile && (
            <>
              <DropdownMenuItem onClick={onMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFollow}>
                <UserPlus className="h-4 w-4 mr-2" />
                Theo dõi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onBlock}>
                <UserMinus className="h-4 w-4 mr-2" />
                Chặn người dùng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReport}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Báo cáo
              </DropdownMenuItem>
            </>
          )}
          {isOwnProfile && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Settings className="h-4 w-4 mr-2" />
                Chỉnh sửa hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt tài khoản
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
