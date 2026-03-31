import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "./queryKeys";
import type { Feature } from "../types/feature";

export function useFeature(slug: string | undefined) {
  return useQuery<Feature>({
    queryKey: queryKeys.features.detail(slug ?? ""),
    queryFn: async () => {
      const res = await api.get(`/features/${slug}/`);
      return res.data;
    },
    enabled: !!slug,
  });
}
