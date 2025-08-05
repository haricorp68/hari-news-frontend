import { useQuery } from "@tanstack/react-query";
import { getFollowStatsApi } from "../follow.api";
import type { GetFollowStatsResponse } from "../follow.interface";

export function useFollowStats(userId: string, enabled: boolean = true) {
  const query = useQuery<GetFollowStatsResponse, Error>({
    queryKey: ["followStats", userId],
    queryFn: () => getFollowStatsApi(userId),
    enabled: enabled && !!userId,
  });

  return {
    followStats: query.data?.data,
    followStatsLoading: query.isLoading,
    followStatsError: query.error,
    refetchFollowStats: query.refetch,
  };
}
