"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { useUserDetail } from "@/lib/modules/user/hooks/useUserDetail";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { profile: currentUser } = useAuth();

  // Lấy thông tin user theo id trên url
  const { user, userLoading } = useUserDetail(userId);

  const isOwnProfile = currentUser?.id === userId;

  if (userLoading) return <ProfilePageSkeleton />;
  if (!user) return <ProfileNotFound />;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <ProfileCover coverImage={user.coverImage} />
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
      <ProfileTabs userId={userId} />
    </div>
  );
}
