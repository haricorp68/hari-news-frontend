import { useQuery } from "@tanstack/react-query";
import {
  getAllUsersApi,
  getUserByIdApi,
  getSelfUserConfigApi,
} from "./user.api";
import type {
  GetSelfUserConfigResponse,
  FindAllUsersResponse,
  FindUserResponse,
} from "./user.interface";

export function useUser(userId?: string) {
  // Lấy danh sách user
  const usersQuery = useQuery<FindAllUsersResponse, Error>({
    queryKey: ["users"],
    queryFn: getAllUsersApi,
  });

  // Lấy chi tiết user theo id (nếu có userId)
  const userDetailQuery = useQuery<FindUserResponse, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserByIdApi(userId!),
    enabled: !!userId,
  });

  // Lấy config cá nhân
  const userConfigQuery = useQuery<GetSelfUserConfigResponse, Error>({
    queryKey: ["userConfigSelf"],
    queryFn: getSelfUserConfigApi,
  });

  return {
    users: usersQuery.data?.data,
    usersLoading: usersQuery.isLoading,
    user: userDetailQuery.data?.data,
    userLoading: userDetailQuery.isLoading,
    userConfig: userConfigQuery.data?.data,
    userConfigLoading: userConfigQuery.isLoading,
    refetchUsers: usersQuery.refetch,
    refetchUser: userDetailQuery.refetch,
    refetchUserConfig: userConfigQuery.refetch,
  };
}
