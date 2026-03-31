import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { CreateFeatureResponse, FeatureFormData } from "../types/feature";

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation<CreateFeatureResponse, Error, FeatureFormData>({
    mutationFn: async (data) => {
      const res = await api.post("/features/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features", "list"] });
    },
  });
}
