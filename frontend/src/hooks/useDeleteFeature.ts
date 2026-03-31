import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (slug) => {
      await api.delete(`/features/${slug}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features", "list"] });
    },
  });
}
