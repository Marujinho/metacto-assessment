import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "./queryKeys";
import type { Feature, FeatureFormData } from "../types/feature";

export function useUpdateFeature(slug: string) {
  const queryClient = useQueryClient();

  return useMutation<Feature, Error, FeatureFormData>({
    mutationFn: async (data) => {
      const res = await api.patch(`/features/${slug}/`, data);
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.features.detail(slug), updated);
      queryClient.invalidateQueries({ queryKey: ["features", "list"] });
    },
  });
}
