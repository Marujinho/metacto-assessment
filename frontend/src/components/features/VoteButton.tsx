import { ChevronUp } from "lucide-react";
import type { Feature } from "../../types/feature";
import { useVote } from "../../hooks/useVote";
import { useUnvote } from "../../hooks/useUnvote";
import { useRequireAuth } from "../../hooks/useRequireAuth";

interface VoteButtonProps {
  feature: Feature;
}

export function VoteButton({ feature }: VoteButtonProps) {
  const { requireAuth } = useRequireAuth();
  const vote = useVote();
  const unvote = useUnvote();

  const isPending = vote.isPending || unvote.isPending;

  const handleClick = () => {
    requireAuth(() => {
      if (feature.has_voted) {
        unvote.mutate(feature.slug);
      } else {
        vote.mutate(feature.slug);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 min-w-[3rem] transition-colors ${
        feature.has_voted
          ? "border-indigo-300 bg-indigo-50 text-indigo-600"
          : "border-gray-300 bg-white text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <ChevronUp size={18} />
      <span className="text-xs font-semibold">{feature.vote_count}</span>
    </button>
  );
}
