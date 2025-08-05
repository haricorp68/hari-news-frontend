import { useQuery } from "@tanstack/react-query";
import { getFollowingApi } from "../follow.api";
import type {
  GetFollowingResponse,
  GetFollowingParams,
} from "../follow.interface";

export function useFollowing(
  params: GetFollowingParams,
  enabled: boolean = true
) {
  const query = useQuery<GetFollowingResponse, Error>({
    queryKey: ["following", params.userId, params.page, params.pageSize],
    queryFn: () => getFollowingApi(params),
    enabled: enabled && !!params.userId,
  });

  return {
    following: query.data?.data,
    followingMetadata: query.data?.metadata,
    followingLoading: query.isLoading,
    followingError: query.error,
    refetchFollowing: query.refetch,
  };
}
