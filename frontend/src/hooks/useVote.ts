import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api";
import { getErrorMessage } from "../lib/errorMessages";
import type { Feature, PaginatedResponse } from "../types/feature";
import { useFeatureListParams } from "./useFeatureListParams";
import { queryKeys } from "./queryKeys";

export function useVote() {
  const queryClient = useQueryClient();
  const params = useFeatureListParams();

  return useMutation({
    mutationFn: (slug: string) => api.post(`/features/${slug}/vote/`),

    onMutate: async (slug) => {
      const listKey = queryKeys.features.list(params);
      const detailKey = queryKeys.features.detail(slug);

      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousList = queryClient.getQueryData<PaginatedResponse<Feature>>(listKey);
      const previousDetail = queryClient.getQueryData<Feature>(detailKey);

      queryClient.setQueryData<PaginatedResponse<Feature>>(listKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((f) =>
            f.slug === slug
              ? { ...f, vote_count: f.vote_count + 1, has_voted: true }
              : f
          ),
        };
      });

      queryClient.setQueryData<Feature>(detailKey, (old) => {
        if (!old) return old;
        return { ...old, vote_count: old.vote_count + 1, has_voted: true };
      });

      return { previousList, previousDetail, listKey, detailKey };
    },

    onError: (_err, _slug, context) => {
      if (context?.previousList)
        queryClient.setQueryData(context.listKey, context.previousList);
      if (context?.previousDetail)
        queryClient.setQueryData(context.detailKey, context.previousDetail);
      toast.error(getErrorMessage(_err));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["features", "list"] });
    },
  });
}
