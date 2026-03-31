import { useSearchParams } from "react-router-dom";
import type { FeatureListParams } from "../types/feature";

export function useFeatureListParams(): FeatureListParams {
  const [searchParams] = useSearchParams();
  return {
    page: Number(searchParams.get("page")) || 1,
    sort: (searchParams.get("sort") as "top" | "newest") || "top",
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
  };
}
