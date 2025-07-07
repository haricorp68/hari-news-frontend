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
  token: string;
}

export type RegisterResponse = APIResponse<null>;
