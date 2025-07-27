import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../user.api"; // Adjust the import path if needed
import { APIResponse } from "@/lib/types/api-response";
import { UpdateProfileDto, User } from "../user.interface";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    APIResponse<User>, // Expected response type
    Error, // Error type
    { data: UpdateProfileDto } // The data needed for the mutation (your UpdateUserDto)
  >({
    mutationFn: ({ data }) => updateProfile(data), // Pass the data to your updateProfile API
    onSuccess: () => {
      // Invalidate queries related to the user profile to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileLoading: mutation.isPending,
    updateProfileError: mutation.error,
    updateProfileSuccess: mutation.isSuccess,
  };
}
