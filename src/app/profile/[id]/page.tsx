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
  // Lấy cả isHydrated từ store
  const { profile: currentUser, isHydrated } = useAuthStore();

  const isOwnProfile = currentUser?.id === userId;

  // Điều kiện để quyết định có gọi API hay không
  // 1. `isHydrated` phải là `true` để đảm bảo `currentUser` có giá trị chính xác.
  // 2. VÀ `!isOwnProfile` để chỉ gọi API khi xem profile của người khác.
  const shouldFetchUser = isHydrated && !isOwnProfile;

  const { user, userLoading } = useUserDetail(userId, {
    enabled: shouldFetchUser, // Sử dụng shouldFetchUser làm điều kiện kích hoạt
  });

  // Hiển thị skeleton trong các trường hợp:
  // 1. Store chưa hydrate (vì lúc này currentUser chưa chắc đúng).
  // 2. Hoặc đang tải dữ liệu người dùng (userLoading) và không phải profile của chính mình.
  if (!isHydrated || (userLoading && !isOwnProfile)) {
    return <ProfilePageSkeleton />;
  }

  // Xác định dữ liệu người dùng sẽ được hiển thị
  // Nếu là profile của chính người dùng, ưu tiên currentUser.
  // Nếu không, sử dụng dữ liệu từ API (user).
  const displayedUser = isOwnProfile ? currentUser : user;

  // Nếu sau khi tất cả các kiểm tra, vẫn không có dữ liệu người dùng để hiển thị,
  // nghĩa là không tìm thấy profile.
  if (!displayedUser) return <ProfileNotFound />;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <ProfileHeader user={displayedUser} isOwnProfile={isOwnProfile} />
      <ProfileTabs userId={userId} />
    </div>
  );
}
