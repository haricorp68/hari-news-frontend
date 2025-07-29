import { useQuery } from "@tanstack/react-query";
import { getUserByIdApi } from "../user.api";
import type { FindUserResponse } from "../user.interface";

// Định nghĩa interface cho các tùy chọn của hook
interface UseUserDetailOptions {
  enabled?: boolean; // enabled có thể là boolean hoặc undefined
}

export function useUserDetail(userId?: string, options?: UseUserDetailOptions) {
  console.log("Hook useUserDetail đã được gọi!");
  const query = useQuery<FindUserResponse, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserByIdApi(userId!),
    // Kết hợp enabled từ options và điều kiện !!userId
    enabled: !!userId && (options?.enabled ?? true),
  });
  return {
    user: query.data?.data,
    userLoading: query.isLoading,
    refetchUser: query.refetch,
  };
}
