import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../auth.api";
import { APIResponse } from "@/lib/types/api-response";
import { LoginRequest } from "../auth.interface";
import { toast } from "sonner";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation<APIResponse<null>, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
} 