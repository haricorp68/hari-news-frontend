import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi } from "../user.api";
import type { FindAllUsersResponse } from "../user.interface";

export function useUserList() {
  return useQuery<FindAllUsersResponse, Error>({
    queryKey: ["users"],
    queryFn: getAllUsersApi,
  });
} 