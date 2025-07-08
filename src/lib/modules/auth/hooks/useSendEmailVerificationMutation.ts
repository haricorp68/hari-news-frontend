import { useMutation } from "@tanstack/react-query";
import { sendEmailVerificationApi } from "../auth.api";
import { SendEmailVerificationRequest, SendEmailVerificationResponse } from "../auth.interface";
import { toast } from "sonner";

export function useSendEmailVerificationMutation() {
  return useMutation<SendEmailVerificationResponse, Error, SendEmailVerificationRequest>({
    mutationFn: sendEmailVerificationApi,
    onSuccess: (res) => {
      toast.success(res.message);
    },
  });
} 