export type FeatureStatus =
  | "open"
  | "planned"
  | "in_progress"
  | "completed"
  | "declined";

export interface FeatureAuthor {
  id: number;
  username: string;
}

export interface DuplicateOf {
  id: number;
  slug: string;
  title: string;
}

export interface Feature {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: FeatureAuthor | null;
  status: FeatureStatus;
  vote_count: number;
  has_voted: boolean;
  is_owner: boolean;
  duplicate_of: DuplicateOf | null;
  created_at: string;
  updated_at: string;
}

export interface SimilarFeature {
  id: number;
  slug: string;
  title: string;
  vote_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateFeatureResponse {
  created: boolean;
  feature: Feature;
  similar_features?: SimilarFeature[];
}

export interface VoteResponse {
  vote_count: number;
  has_voted: boolean;
}

export interface FeatureFormData {
  title: string;
  description: string;
}

export interface FeatureListParams {
  page?: number;
  sort?: "top" | "newest";
  status?: string;
  search?: string;
}
