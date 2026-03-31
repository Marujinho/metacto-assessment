import { Link } from "react-router-dom";
import { AlertTriangle, ChevronUp } from "lucide-react";
import type { SimilarFeature } from "../../types/feature";

interface SimilarFeaturesAlertProps {
  features: SimilarFeature[];
}

export function SimilarFeaturesAlert({ features }: SimilarFeaturesAlertProps) {
  if (features.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-amber-700">
          Similar features already exist. Consider voting on these instead:
        </p>
      </div>
      <ul className="space-y-1 ml-6">
        {features.map((f) => (
          <li key={f.id} className="flex items-center gap-2 text-sm">
            <Link
              to={`/features/${f.slug}`}
              className="text-amber-800 hover:underline"
            >
              {f.title}
            </Link>
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
              <ChevronUp size={12} />
              {f.vote_count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
