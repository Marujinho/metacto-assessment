import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No features yet",
  message = "Be the first to submit a feature request!",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}
