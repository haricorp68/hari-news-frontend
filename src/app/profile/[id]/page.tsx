"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { useUser } from "@/lib/modules/user/useUser";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { profile: currentUser } = useAuth();
  const { user, userLoading } = useUser(userId);

  const isOwnProfile = currentUser?.id === userId;

  if (userLoading) return <ProfilePageSkeleton />;
  if (!user) return <ProfileNotFound />;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <ProfileCover coverImage={user.coverImage} />
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
      <ProfileTabs />
    </div>
  );
} 