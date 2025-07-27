import { getApi, patchApi } from "@/lib/api/api";
import type { UpdateProfileDto, User } from "./user.interface";
import type { PaginationMetadata, APIResponse } from "@/lib/types/api-response";
import type { GetSelfUserConfigResponse, UserConfig } from "./user.interface";

export async function getAllUsersApi(): Promise<
  APIResponse<User[], PaginationMetadata | undefined>
> {
  return getApi<User[]>("/user");
}

export async function getUserByIdApi(id: string): Promise<APIResponse<User>> {
  return getApi<User>(`/user/${id}`);
}

export async function getSelfUserConfigApi(): Promise<GetSelfUserConfigResponse> {
  return getApi<UserConfig>("/user/config/self");
}

export async function updateProfile(
  body: UpdateProfileDto
): Promise<APIResponse<User>> {
  return patchApi<User>(`/user/profile`, body);
}
