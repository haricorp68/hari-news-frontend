import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerApi } from "../auth.api";
import { RegisterRequest, RegisterResponse } from "../auth.interface";
import { toast } from "sonner";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerApi,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
} 