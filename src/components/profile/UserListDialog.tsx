"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User } from "lucide-react";
import { useFollowers } from "@/lib/modules/follow/hooks/useFollowers";
import { useFollowing } from "@/lib/modules/follow/hooks/useFollowingHook";
import { useAuthStore } from "@/lib/modules/auth/auth.store";
import Image from "next/image";
import Link from "next/link";

interface UserListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export function UserListDialog({
  open,
  onOpenChange,
  userId,
  type,
  title,
}: UserListDialogProps) {
  const { profile: currentUser } = useAuthStore();

  const followersQuery = useFollowers(
    { userId, page: 1, pageSize: 20 },
    type === "followers" && open
  );

  const followingQuery = useFollowing(
    { userId, page: 1, pageSize: 20 },
    type === "following" && open
  );

  const { followers, followersLoading, followersError } = followersQuery;

  const { following, followingLoading, followingError } = followingQuery;

  const users = type === "followers" ? followers : following;
  const loading = type === "followers" ? followersLoading : followingLoading;
  const error = type === "followers" ? followersError : followingError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-muted-foreground">
              Có lỗi xảy ra khi tải danh sách
            </div>
          )}

          {users && users.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có{" "}
              {type === "followers" ? "người theo dõi" : "người đang theo dõi"}
            </div>
          )}

          {users &&
            users.map((followData) => {
              const user =
                type === "followers"
                  ? followData.follower
                  : followData.following;
              if (!user) return null;

              const isCurrentUser = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg"
                >
                  {/* Avatar */}
                  <Link href={`/profile/${user.id}`} className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* User Info */}
                  <div className="flex-1 justify-between min-w-0">
                    <Link href={`/profile/${user.id}`}>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate hover:underline">
                          {user.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {user.bio}
                        </p>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
