import { getApi, postApi } from "@/lib/api/api";
import { LoginRequest, LoginResponse, MeResponse, RegisterRequest, RegisterResponse } from "./auth.interface";

export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
  return postApi<null>("/auth/login", body);
}

export async function getProfileApi(): Promise<MeResponse> {
  return getApi<{ user: MeResponse["data"]["user"] }>("/auth/me");
}

export async function registerApi(body: RegisterRequest): Promise<RegisterResponse> {
  return postApi<null>("/auth/register", body);
}
