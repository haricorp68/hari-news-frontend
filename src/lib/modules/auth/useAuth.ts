import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { LoginRequest, MeResponse } from "./auth.interface";
import { useAuthStore } from "./auth.store";
import { getProfileApi, loginApi } from "./auth.api";
import { APIResponse } from "@/lib/types/api-response";

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Lấy profile nếu đã login (cookie đã có token)
  const profileQuery = useQuery<MeResponse, Error>({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: false,
  });

  // Đăng nhập
  const loginMutation = useMutation<APIResponse<null>, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  useEffect(() => {
    if (profileQuery.data?.data?.user) setUser(profileQuery.data.data.user);
    if (profileQuery.isError) logout();
  }, [profileQuery.data, profileQuery.isError]);

  return {
    user,
    profile: profileQuery.data?.data?.user,
    profileLoading: profileQuery.isLoading,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout,
  };
}
