import { useQuery } from "@tanstack/react-query";
import { getFollowersApi } from "../follow.api";
import type {
  GetFollowersResponse,
  GetFollowersParams,
} from "../follow.interface";

export function useFollowers(
  params: GetFollowersParams,
  enabled: boolean = true
) {
  const query = useQuery<GetFollowersResponse, Error>({
    queryKey: ["followers", params.userId, params.page, params.pageSize],
    queryFn: () => getFollowersApi(params),
    enabled: enabled && !!params.userId,
  });

  return {
    followers: query.data?.data,
    followersMetadata: query.data?.metadata,
    followersLoading: query.isLoading,
    followersError: query.error,
    refetchFollowers: query.refetch,
  };
}
