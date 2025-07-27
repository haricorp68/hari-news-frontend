"use client";

import { useParams } from "next/navigation";
import { useUserDetail } from "@/lib/modules/user/hooks/useUserDetail";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { useAuthStore } from "@/lib/modules/auth/auth.store";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { profile: currentUser } = useAuthStore();

  // Lấy thông tin user theo id trên url
  const { user, userLoading } = useUserDetail(userId);

  const isOwnProfile = currentUser?.id === userId;

  if (userLoading) return <ProfilePageSkeleton />;
  if (!user) return <ProfileNotFound />;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        coverImage={user.coverImage}
      />
      <ProfileTabs userId={userId} />
    </div>
  );
}
