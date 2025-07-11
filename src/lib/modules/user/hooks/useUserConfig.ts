import { useQuery } from "@tanstack/react-query";
import { getSelfUserConfigApi } from "../user.api";
import type { GetSelfUserConfigResponse } from "../user.interface";

export function useUserConfig() {
  return useQuery<GetSelfUserConfigResponse, Error>({
    queryKey: ["userConfigSelf"],
    queryFn: getSelfUserConfigApi,
  });
} 