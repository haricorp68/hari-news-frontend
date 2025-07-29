"use client";

import { User } from "@/lib/modules/user/user.interface";
import { Button } from "@/components/ui/button";
import { Settings, User as UserIcon, Edit2, AtSign } from "lucide-react";
import Image from "next/image";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  coverImage?: string | null;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  coverImage,
}: ProfileHeaderProps) {
  return (
    <div>
      {coverImage && (
        <div className="w-full h-40 md:h-60 bg-muted mb-0">
          <Image
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            width={160}
            height={160}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:gap-12 gap-6 py-8 px-4 bg-white">
        {/* Avatar */}
        <div className="flex justify-center md:block">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Username + actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <span className="text-2xl md:text-3xl font-semibold">
              {user.name}
            </span>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <EditProfileDialog
                  user={user}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Chỉnh sửa trang cá nhân
                    </Button>
                  }
                />
              ) : (
                <Button size="sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Theo dõi
                </Button>
              )}
              {isOwnProfile && (
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-8 text-sm">
            <span>
              <span className="font-semibold">1</span> bài viết
            </span>
            <span>
              <span className="font-semibold">{user.followersCount}</span> người
              theo dõi
            </span>
            <span>
              Đang theo dõi{" "}
              <span className="font-semibold">{user.followingCount}</span>
            </span>
          </div>
          {/* Bio va alias */}
          <div className="space-y-1">
            {user.alias && (
              <div className="text-sm font-semibold flex items-center gap-0.5 bg-slate-50 p-1 w-fit border-2 rounded-xl">
                <AtSign className="w-4 h-4" strokeWidth={2.5} />
                {user.alias}
              </div>
            )}
            {user.bio && (
              <div className="text-muted-foreground">{user.bio}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
