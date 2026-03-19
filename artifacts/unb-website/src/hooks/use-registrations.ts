import { useCreateRegistration as useOrvalCreateRegistration } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListRegistrationsQueryKey } from "@workspace/api-client-react";

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  
  return useOrvalCreateRegistration({
    mutation: {
      onSuccess: () => {
        // Invalidate list if admin dashboard existed
        queryClient.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
      },
    }
  });
}
