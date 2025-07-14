"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { profileLoading, profile: currentUser } = useAuth();

  const isOwnProfile = currentUser?.id === userId;

  if (profileLoading) return <ProfilePageSkeleton />;
  if (!currentUser) return <ProfileNotFound />;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <ProfileCover coverImage={currentUser.coverImage} />
      <ProfileHeader user={currentUser} isOwnProfile={isOwnProfile} />
      <ProfileTabs />
    </div>
  );
}
