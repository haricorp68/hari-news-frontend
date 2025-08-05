import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowApi } from "../follow.api";
import type { ToggleFollowResponse } from "../follow.interface";

export function useToggleFollow() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ToggleFollowResponse, Error, string>({
    mutationFn: (followingId: string) => toggleFollowApi(followingId),
    onSuccess: (data, followingId) => {
      const newFollowStatus = data.data?.isFollowing;
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followStats"] });
      queryClient.setQueryData(
        ["followStatus", followingId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              isFollowing: newFollowStatus,
              follow: newFollowStatus ? {} : null,
            },
          };
        }
      );
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["followStatus", followingId],
        });
      }, 100);
    },
  });

  return {
    toggleFollow: mutation.mutate,
    toggleFollowLoading: mutation.isPending,
    toggleFollowError: mutation.error,
    toggleFollowData: mutation.data?.data,
  };
}
