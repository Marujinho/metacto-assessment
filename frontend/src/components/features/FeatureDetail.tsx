import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import type { Feature } from "../../types/feature";
import { StatusBadge } from "./StatusBadge";
import { VoteButton } from "./VoteButton";

interface FeatureDetailProps {
  feature: Feature;
  ownerControls?: React.ReactNode;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeatureDetail({ feature, ownerControls }: FeatureDetailProps) {
  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to features
      </Link>

      {feature.duplicate_of && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          This feature was merged into{" "}
          <Link
            to={`/features/${feature.duplicate_of.slug}`}
            className="font-medium underline"
          >
            {feature.duplicate_of.title}
          </Link>
          .
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex gap-5">
          <div className="shrink-0">
            <VoteButton feature={feature} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">
                {feature.title}
              </h1>
              <StatusBadge status={feature.status} />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
              <span className="inline-flex items-center gap-1">
                <User size={14} />
                {feature.author?.username ?? "Deleted user"}
              </span>
              <span>{formatDate(feature.created_at)}</span>
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {feature.description}
            </p>

            {ownerControls && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                {ownerControls}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
