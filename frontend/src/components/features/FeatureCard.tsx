import { Link } from "react-router-dom";
import { MessageSquare, User } from "lucide-react";
import type { Feature } from "../../types/feature";
import { StatusBadge } from "./StatusBadge";

interface FeatureCardProps {
  feature: Feature;
  voteButton: React.ReactNode;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FeatureCard({ feature, voteButton }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
      <div className="flex gap-4">
        <div className="shrink-0">{voteButton}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <Link
              to={`/features/${feature.slug}`}
              className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {feature.title}
            </Link>
            {feature.status !== "open" && (
              <StatusBadge status={feature.status} />
            )}
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {feature.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {feature.author?.username ?? "Deleted user"}
            </span>
            <span>{timeAgo(feature.created_at)}</span>
            {feature.duplicate_of && (
              <Link
                to={`/features/${feature.duplicate_of.slug}`}
                className="inline-flex items-center gap-1 text-amber-600 hover:underline"
              >
                <MessageSquare size={12} />
                Merged into: {feature.duplicate_of.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
