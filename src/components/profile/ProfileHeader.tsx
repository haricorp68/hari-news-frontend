"use client";

import { User } from "@/lib/modules/user/user.interface";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Edit2,
  AtSign,
  Camera,
  UserPlus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { EditProfileDialog } from "./EditProfileDialog";
import TextType from "../ui/TextType/TextType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/modules/auth/useAuth";
import React from "react";
import { useUpdateProfile } from "@/lib/modules/user/hooks/useUpdateProfile";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { UploadResult } from "../CloudinaryUpload";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  coverImage?: string | null;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const { logout, logoutLoading } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [avatarLoading, setAvatarLoading] = React.useState(false);
  const [coverLoading, setCoverLoading] = React.useState(false);
  const { updateProfile } = useUpdateProfile();

  const handleLogout = () => {
    logout();
  };

  const handleAvatarUploadSuccess = (result: any) => {
    const imageData: UploadResult = result.info;
    if (imageData && imageData.secure_url) {
      updateProfile({ data: { avatar: imageData.secure_url } });
      toast.success("Cập nhật avatar thành công!");
    } else {
      toast.error("Không tìm thấy URL ảnh sau khi upload.");
    }
    setAvatarLoading(false);
  };

  const handleCoverUploadSuccess = (result: any) => {
    const imageData: UploadResult = result.info;
    if (imageData && imageData.secure_url) {
      updateProfile({ data: { coverImage: imageData.secure_url } });
      toast.success("Cập nhật ảnh bìa thành công!");
    } else {
      toast.error("Không tìm thấy URL ảnh sau khi upload.");
    }
    setCoverLoading(false);
  };

  return (
    <div>
      {/* Cover Image Section */}
      <div className="w-full h-40 md:h-60 bg-muted mb-0 relative">
        {user.coverImage ? (
          <Image
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            width={160}
            height={160}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center" />
        )}
        {isOwnProfile && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleCoverUploadSuccess}
            onOpen={() => setCoverLoading(true)}
            onClose={() => setCoverLoading(false)}
            options={{
              maxFiles: 1,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
              folder: `users/${user.id}/covers`,
            }}
          >
            {({ open }) => {
              return (
                <Button
                  className="absolute bottom-4 right-4"
                  variant="outline"
                  size="sm"
                  onClick={() => open()}
                  disabled={coverLoading}
                >
                  {coverLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 mr-2" />
                  )}
                  {user.coverImage ? "Cập nhật" : "Thêm ảnh bìa"}
                </Button>
              );
            }}
          </CldUploadWidget>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:gap-12 gap-6 py-8 px-4 bg-white">
        {/* Avatar */}
        <div className="flex justify-center md:block relative">
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
          {isOwnProfile && (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={handleAvatarUploadSuccess}
              onOpen={() => setAvatarLoading(true)}
              onClose={() => setAvatarLoading(false)}
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
                folder: `users/${user.id}/avatars`,
              }}
            >
              {({ open }) => {
                return (
                  <Button
                    className="absolute bottom-2 right-2 rounded-full"
                    variant="outline"
                    size="icon"
                    onClick={() => open()}
                    disabled={avatarLoading}
                  >
                    {avatarLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                );
              }}
            </CldUploadWidget>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Username + alias + actions */}
          <div className="flex justify-between md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1">
              <span className="text-2xl md:text-3xl font-semibold">
                {user.name}
              </span>
              {user.alias && (
                <div className="text-xs font-semibold flex items-center gap-0.5 w-fit bg-slate-100 px-2 py-1 rounded-xl">
                  <AtSign className="w-4 h-4" strokeWidth={2.5} />
                  {user.alias}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <EditProfileDialog
                  user={user}
                  trigger={
                    <Button variant="outline" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  }
                />
              ) : (
                <Button size="sm">
                  <UserPlus className="w-4 h-4" />
                  Theo dõi
                </Button>
              )}
              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Cài đặt tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Report với Admin</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className=" font-semibold"
                      variant="destructive"
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-8 text-sm">
            <span>
              <span className="font-semibold">
                {user.userNewsPostsCount + user.userFeedPostsCount}
              </span>{" "}
              bài đăng
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
          {/* Bio */}
          <div className="space-y-1">
            {user.bio && (
              <TextType
                key={user.bio}
                text={user.bio}
                textColors={["##FFF"]}
                typingSpeed={80}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
                loop={false}
                textClassName="text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={logoutLoading}
            >
              Hủy
            </Button>
            <Button onClick={handleLogout} disabled={logoutLoading}>
              {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
