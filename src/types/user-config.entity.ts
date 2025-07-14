import { User } from "@/lib/modules/user/user.interface";

export interface UserConfig {
  id: number;
  user: User | number;
  userId: number;
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    privacyLevel?: "public" | "friends" | "private";
    theme?: "light" | "dark" | "auto";
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  created_at: Date;
  updated_at: Date;
}

// Import User từ user.entity nếu cần
