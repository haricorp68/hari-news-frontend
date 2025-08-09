"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useFollowStatus } from "@/lib/modules/follow/hooks/useFollowStatusCheck";
import { useToggleFollow } from "@/lib/modules/follow/hooks/useToggleFollow";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/modules/auth/auth.store";

interface FollowButtonProps {
  userId: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function FollowButton({
  userId,
  size = "sm",
  variant = "default",
}: FollowButtonProps) {
  const {
    isFollowing,

    loading: statusLoading,
    updateStatus,
  } = useFollowStatus(userId);
  const { toggleFollow, toggleFollowLoading } = useToggleFollow();
  const { setShowLoginDialog, profile } = useAuthStore();

  const handleToggleFollow = () => {
    if (!profile) {
      toast.warning("Vui lòng đăng nhập để theo dõi người dùng này");
      setShowLoginDialog(true); // Hiển thị dialog nếu chưa đăng nhập
      return;
    }
    toggleFollow(userId, {
      onSuccess: (data) => {
        const newFollowStatus = data.data?.isFollowing ?? false;
        updateStatus({ isFollowing: newFollowStatus });

        toast.success(data.message);
      },
      onError: (error) => {
        //mark
        console.error("Toggle follow error:", error);
      },
    });
  };

  if (statusLoading) {
    return (
      <Button size={size} variant={variant} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Đang tải...
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={isFollowing ? "outline" : variant}
      onClick={handleToggleFollow}
      disabled={toggleFollowLoading}
    >
      {toggleFollowLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
    </Button>
  );
}
