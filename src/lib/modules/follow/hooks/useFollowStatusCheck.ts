import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/modules/auth/auth.store";
import { checkFollowStatusApi } from "../follow.api";
import type { CheckFollowStatusResponse } from "../follow.interface";

export function useFollowStatus(userId: string) {
  const { profile: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useQuery<CheckFollowStatusResponse, Error>({
    queryKey: ["followStatus", userId],
    queryFn: () => checkFollowStatusApi(userId),
    enabled: !!currentUser?.id && currentUser.id !== userId,
    staleTime: 0,
    gcTime: 0,
  });

  const updateStatus = (newStatus: {
    isFollowing: boolean;
    followData?: any;
  }) => {
    queryClient.setQueryData(
      ["followStatus", userId],
      (oldData: CheckFollowStatusResponse | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            isFollowing: newStatus.isFollowing,
            follow: newStatus.followData,
          },
        };
      }
    );
  };

  return {
    isFollowing: query.data?.data?.isFollowing ?? false,
    followData: query.data?.data?.follow,
    loading: query.isLoading,
    error: query.error,
    updateStatus,
    refetch: query.refetch,
  };
}
