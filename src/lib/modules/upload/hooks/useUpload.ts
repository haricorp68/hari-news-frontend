import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadToCloudinaryApi } from "../upload.api";

interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

interface UseUploadResult {
  uploadMedia: (file: File) => Promise<UploadResult>;
  isUploading: boolean;
  error: Error | null;
}

export const useUpload = (): UseUploadResult => {
  const { mutateAsync, isPending, error } = useMutation<
    UploadResult,
    Error,
    File
  >({
    mutationFn: uploadToCloudinaryApi,
    onSuccess: () => {
      toast.success("Upload thành công!");
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra khi upload file: ${error.message}`);
    },
  });

  return {
    uploadMedia: mutateAsync,
    isUploading: isPending,
    error,
  };
};
