import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "./queryKeys";
import { useFeatureListParams } from "./useFeatureListParams";
import type { Feature, PaginatedResponse } from "../types/feature";

export function useFeatures() {
  const params = useFeatureListParams();

  return useQuery<PaginatedResponse<Feature>>({
    queryKey: queryKeys.features.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page && params.page > 1)
        searchParams.set("page", String(params.page));
      if (params.sort) searchParams.set("sort", params.sort);
      if (params.status) searchParams.set("status", params.status);
      if (params.search) searchParams.set("search", params.search);

      const res = await api.get(`/features/?${searchParams.toString()}`);
      return res.data;
    },
  });
}
