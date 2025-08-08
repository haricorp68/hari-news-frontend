import { useQuery } from "@tanstack/react-query";
import { getUserNewsPostSearchApi } from "../post.api";
import type { UserNewsPostSearch } from "../post.interface";

export function useUserNewsPostSearch(query: string, enabled = true) {
  return useQuery<UserNewsPostSearch[], Error>({
    queryKey: ["userNewsPostSearch", query],
    queryFn: () => getUserNewsPostSearchApi(query).then(res => res.data),
    enabled: !!query && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
