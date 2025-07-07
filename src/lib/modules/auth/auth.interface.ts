import type { APIResponse } from "@/lib/types/api-response";
import type { User } from "@/lib/modules/user/user.interface";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = APIResponse<null>;
export type MeResponse = APIResponse<{ user: User }>;

// Thêm cho register
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  token: number;
}

export type RegisterResponse = APIResponse<null>;

// Send email verification
export interface SendEmailVerificationRequest {
  email: string;
}
export type SendEmailVerificationResponse = APIResponse<null>;

// Logout
export type LogoutResponse = APIResponse<null>;

// Refresh token
export type RefreshTokenResponse = APIResponse<null>;

// Forgot password
export interface ForgotPasswordRequest {
  email: string;
}
export type ForgotPasswordResponse = APIResponse<null>;

// Reset password
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
export type ResetPasswordResponse = APIResponse<null>;

// Change password
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
export type ChangePasswordResponse = APIResponse<null>;
