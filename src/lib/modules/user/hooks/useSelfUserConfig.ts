import { useQuery } from "@tanstack/react-query";
import { getSelfUserConfigApi } from "../user.api";
import type { GetSelfUserConfigResponse } from "../user.interface";

export function useSelfUserConfig(enabled: boolean = true) {
  const query = useQuery<GetSelfUserConfigResponse, Error>({
    queryKey: ["userConfigSelf"],
    queryFn: getSelfUserConfigApi,
    enabled,
  });
  return {
    userConfig: query.data?.data,
    userConfigLoading: query.isLoading,
    refetchUserConfig: query.refetch,
  };
} 