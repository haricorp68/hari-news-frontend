import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "../user.api";
import type { FindUserResponse } from "../user.interface";

export function useUserDetail(userId?: string, enabled: boolean = true) {
  const query = useQuery<FindUserResponse, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserByIdApi(userId!),
    enabled: !!userId && enabled,
  });
  return {
    user: query.data?.data,
    userLoading: query.isLoading,
    refetchUser: query.refetch,
  };
} 