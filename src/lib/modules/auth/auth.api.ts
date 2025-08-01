import { getApi, postApi } from "@/lib/api/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckExistRequest,
  CheckExistResponse,
} from "./auth.interface";
import type { APIResponse } from "@/lib/types/api-response";
import type { User } from "@/lib/modules/user/user.interface";

export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
  return postApi<null>("/auth/login", body);
}

export async function getProfileApi(): Promise<APIResponse<User>> {
  return getApi<User>("/auth/me", { disableToast: true });
}

export async function registerApi(
  body: RegisterRequest
): Promise<RegisterResponse> {
  return postApi<null>("/auth/register", body);
}

export async function sendEmailVerificationApi(
  body: SendEmailVerificationRequest
): Promise<SendEmailVerificationResponse> {
  return postApi<null>("/auth/send-email-verification", body);
}

export async function logoutApi(): Promise<LogoutResponse> {
  return postApi<null>("/auth/logout");
}

export async function refreshTokenApi(): Promise<RefreshTokenResponse> {
  return postApi<null>("/auth/refresh-token", undefined, {
    disableToast: true,
  });
}

export async function forgotPasswordApi(
  body: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  return postApi<null>("/auth/forgot-password", body);
}

export async function resetPasswordApi(
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  return postApi<null>("/auth/reset-password", body);
}

export async function changePasswordApi(
  body: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  return postApi<null>("/auth/change-password", body);
}

export async function checkExistApi(
  body: CheckExistRequest
): Promise<APIResponse<CheckExistResponse>> {
  return postApi<CheckExistResponse>("/auth/check-exist", body);
}
