import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import {
  LoginRequest,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "./auth.interface";
import { useAuthStore } from "./auth.store";
import {
  getProfileApi,
  loginApi,
  registerApi,
  sendEmailVerificationApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  logoutApi,
  refreshTokenApi,
  checkExistApi,
} from "./auth.api";
import { APIResponse } from "@/lib/types/api-response";
import type { CheckExistRequest } from "./auth.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { setProfile, logout, profile } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Lấy profile nếu đã login (cookie đã có token)
  const profileQuery = useQuery<MeResponse, Error>({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.isError && profileQuery.error) {
      if (profileQuery.error instanceof AxiosError) {
        if (profileQuery.error.response?.status === 401) {
          // AccessToken hết hạn, thử refreshToken
          refreshTokenApi()
            .then(() => {
              // RefreshToken thành công, retry getProfile
              queryClient.invalidateQueries({ queryKey: ["profile"] });
            })
            .catch((refreshError) => {
              // RefreshToken lỗi
              if (
                refreshError instanceof AxiosError &&
                refreshError.response?.status === 403
              ) {
              }
            });
        } else if (profileQuery.error.response?.status === 403) {
        }
      }
    }
  }, [profileQuery.isError, profileQuery.error, router, queryClient]);

  // Đăng nhập
  const loginMutation = useMutation<APIResponse<null>, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (res) => {
      toast.success(res.message);
      profileQuery.refetch();
    },
  });

  // Đăng ký
  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    RegisterRequest
  >({
    mutationFn: registerApi,
    onSuccess: (res) => {
      toast.success(res?.message);
    },
  });

  // Gửi email xác thực
  const sendEmailVerificationMutation = useMutation<
    SendEmailVerificationResponse,
    Error,
    SendEmailVerificationRequest
  >({
    mutationFn: sendEmailVerificationApi,
    onSuccess: (res) => {
      toast.success(res?.message);
    },
  });

  // Quên mật khẩu
  const forgotPasswordMutation = useMutation<
    ForgotPasswordResponse,
    Error,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPasswordApi,
  });

  // Đặt lại mật khẩu
  const resetPasswordMutation = useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordRequest
  >({
    mutationFn: resetPasswordApi,
  });

  // Đổi mật khẩu
  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordRequest
  >({
    mutationFn: changePasswordApi,
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      setProfile(null);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/");
    },
  });

  // Refresh token
  const refreshTokenMutation = useMutation({
    mutationFn: refreshTokenApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  // Realtime check exist (debounce 1000ms)
  const [existError, setExistError] = useState<{
    email?: string;
    name?: string;
  }>({});
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const checkExist = (data: CheckExistRequest) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!data.email && !data.name) return;
      try {
        const res = await checkExistApi(data);
        setExistError((prev) => ({
          email: data.email
            ? res.data.emailExists
              ? res.message
              : undefined
            : prev.email,
          name: data.name
            ? res.data.nameExists
              ? res.message
              : undefined
            : prev.name,
        }));
      } catch {
        // ignore
      }
    }, 1000);
  };

  useEffect(() => {
    if (profileQuery.isFetched) {
      if (profileQuery.isError || !profileQuery.data?.data) {
        setProfile(null);
      } else {
        setProfile(profileQuery.data.data);
      }
    }
  }, [
    profileQuery.data,
    profileQuery.isError,
    profileQuery.isFetched,
    setProfile,
  ]);

  return {
    profile,
    profileLoading: profileQuery.isLoading,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    sendEmailVerification: sendEmailVerificationMutation.mutate,
    sendEmailVerificationLoading: sendEmailVerificationMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordLoading: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordLoading: resetPasswordMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    changePasswordLoading: changePasswordMutation.isPending,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
    refreshToken: refreshTokenMutation.mutate,
    refreshTokenLoading: refreshTokenMutation.isPending,
    checkExist,
    existError,
    setProfile,
  };
}
