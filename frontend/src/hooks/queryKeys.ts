import type { FeatureListParams } from "../types/feature";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  features: {
    all: ["features"] as const,
    list: (params: FeatureListParams) =>
      ["features", "list", params] as const,
    detail: (slug: string) => ["features", "detail", slug] as const,
  },
} as const;
