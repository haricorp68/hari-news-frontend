import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi } from "../user.api";
import type { FindAllUsersResponse } from "../user.interface";

export function useAllUsers(enabled: boolean = true) {
  const query = useQuery<FindAllUsersResponse, Error>({
    queryKey: ["users"],
    queryFn: getAllUsersApi,
    enabled,
  });
  return {
    users: query.data?.data,
    usersLoading: query.isLoading,
    refetchUsers: query.refetch,
  };
} 