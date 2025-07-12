import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  status: string;
  role: string;
  lastLoginAt: string | null;
  loginCount: number;
  lastPasswordChangeAt: string | null;
  deletedAt: string | null;
  created_at: string;
  updated_at: string;
  followersCount: number;
  followingCount: number;
}

export type FindAllUsersResponse = APIResponse<User[], PaginationMetadata | undefined>;

export type FindUserResponse = APIResponse<User, undefined>;

export interface UserConfig {
  id: string;
  userId: string;
  emailNotifications: boolean;
  privacy: string;
}

export type GetSelfUserConfigResponse = APIResponse<UserConfig, undefined>;
