import type { APIResponse, PaginationMetadata } from "@/lib/types/api-response";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
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
}

export type FindAllUsersResponse = APIResponse<User[], PaginationMetadata>;

export type FindUserResponse = APIResponse<User>;
