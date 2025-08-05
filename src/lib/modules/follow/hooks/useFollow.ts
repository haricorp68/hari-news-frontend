import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleFollowApi,
  getFollowersApi,
  getFollowingApi,
  getFollowStatsApi,
} from "../follow.api";
import type {
  ToggleFollowResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetFollowStatsResponse,
} from "../follow.interface";

interface UseFollowOptions {
  enabledFollowers?: boolean;
  enabledFollowing?: boolean;
  enabledStats?: boolean;
  page?: number;
  pageSize?: number;
}

export function useFollow(userId?: string, options?: UseFollowOptions) {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách followers
  const followersQuery = useQuery<GetFollowersResponse, Error>({
    queryKey: ["followers", userId, options?.page, options?.pageSize],
    queryFn: () =>
      getFollowersApi({
        userId: userId!,
        page: options?.page,
        pageSize: options?.pageSize,
      }),
    enabled: !!userId && (options?.enabledFollowers ?? true),
  });

  // 2. Lấy danh sách following
  const followingQuery = useQuery<GetFollowingResponse, Error>({
    queryKey: ["following", userId, options?.page, options?.pageSize],
    queryFn: () =>
      getFollowingApi({
        userId: userId!,
        page: options?.page,
        pageSize: options?.pageSize,
      }),
    enabled: !!userId && (options?.enabledFollowing ?? true),
  });

  // 3. Lấy thống kê follow
  const followStatsQuery = useQuery<GetFollowStatsResponse, Error>({
    queryKey: ["followStats", userId],
    queryFn: () => getFollowStatsApi(userId!),
    enabled: !!userId && (options?.enabledStats ?? true),
  });

  // 4. Toggle follow/unfollow
  const toggleFollowMutation = useMutation<ToggleFollowResponse, Error, string>(
    {
      mutationFn: (followingId: string) => toggleFollowApi(followingId),
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["followers"] });
        queryClient.invalidateQueries({ queryKey: ["following"] });
        queryClient.invalidateQueries({ queryKey: ["followStats"] });
      },
    }
  );

  return {
    // Queries data
    followers: followersQuery.data?.data,
    followersMetadata: followersQuery.data?.metadata,
    followersLoading: followersQuery.isLoading,
    followersError: followersQuery.error,

    following: followingQuery.data?.data,
    followingMetadata: followingQuery.data?.metadata,
    followingLoading: followingQuery.isLoading,
    followingError: followingQuery.error,

    followStats: followStatsQuery.data?.data,
    followStatsLoading: followStatsQuery.isLoading,
    followStatsError: followStatsQuery.error,

    // Mutations
    toggleFollow: toggleFollowMutation.mutate,
    toggleFollowLoading: toggleFollowMutation.isPending,
    toggleFollowError: toggleFollowMutation.error,
    toggleFollowData: toggleFollowMutation.data?.data,

    // Refetch functions
    refetchFollowers: followersQuery.refetch,
    refetchFollowing: followingQuery.refetch,
    refetchFollowStats: followStatsQuery.refetch,
  };
}
