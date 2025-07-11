import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "../user.api";
import type { FindUserResponse } from "../user.interface";

export function useUserDetail(userId?: string) {
  return useQuery<FindUserResponse, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserByIdApi(userId!),
    enabled: !!userId,
  });
} 