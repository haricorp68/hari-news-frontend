"use client"

import { User } from "@/lib/modules/user/user.interface"
import { UserProfile, UserDetails } from "./index"

// Sample user data for demo
const sampleUser: User = {
  id: "754e3af0-53be-483c-997c-dad8c32fc1aa",
  email: "haivu04112003@gmail.com",
  name: "Vũ Hoàng Hải",
  avatar: null,
  coverImage: null,
  bio: "Frontend Developer passionate about creating beautiful and functional user interfaces. Love working with React, TypeScript, and modern web technologies.",
  phone: "+84 123 456 789",
  dateOfBirth: "2003-11-04T00:00:00.000Z",
  gender: "Nam",
  address: "123 Đường ABC",
  city: "Hà Nội",
  isActive: true,
  isVerified: true,
  emailVerifiedAt: "2024-01-15T10:30:00.000Z",
  phoneVerifiedAt: "2024-01-20T14:20:00.000Z",
  status: "active",
  role: "user",
  lastLoginAt: "2024-12-19T08:45:00.000Z",
  loginCount: 42,
  lastPasswordChangeAt: "2024-11-01T16:30:00.000Z",
  deletedAt: null,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-12-19T08:45:00.000Z",
  followersCount: 156,
  followingCount: 89
}

export function UserProfileDemo() {
  const handleFollow = () => {
    console.log("Follow user")
  }

  const handleUnfollow = () => {
    console.log("Unfollow user")
  }

  const handleMessage = () => {
    console.log("Send message")
  }

  const handleEdit = () => {
    console.log("Edit profile")
  }

  const handleFollowersClick = () => {
    console.log("View followers")
  }

  const handleFollowingClick = () => {
    console.log("View following")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">User Profile Components Demo</h1>
      
      {/* Full Profile */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Profile</h2>
        <UserProfile
          user={sampleUser}
          variant="full"
          isFollowing={false}
          isOwnProfile={false}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onMessage={handleMessage}
          onEdit={handleEdit}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
        />
      </section>

      {/* Card Profile */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Profile</h2>
        <div className="max-w-md">
          <UserProfile
            user={sampleUser}
            variant="card"
            isFollowing={true}
            isOwnProfile={false}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onMessage={handleMessage}
            onFollowersClick={handleFollowersClick}
            onFollowingClick={handleFollowingClick}
          />
        </div>
      </section>

      {/* Compact Profile */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Compact Profile</h2>
        <UserProfile
          user={sampleUser}
          variant="compact"
          isFollowing={false}
          isOwnProfile={false}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onMessage={handleMessage}
        />
      </section>

      {/* Own Profile */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Own Profile</h2>
        <UserProfile
          user={sampleUser}
          variant="full"
          isOwnProfile={true}
          onEdit={handleEdit}
          onFollowersClick={handleFollowersClick}
          onFollowingClick={handleFollowingClick}
        />
      </section>

      {/* User Details */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Details</h2>
        <div className="max-w-2xl">
          <UserDetails
            user={sampleUser}
            showSensitiveInfo={true}
          />
        </div>
      </section>
    </div>
  )
} 