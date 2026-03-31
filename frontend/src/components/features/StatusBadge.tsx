import type { FeatureStatus } from "../../types/feature";

const config: Record<FeatureStatus, { label: string; classes: string }> = {
  open: { label: "Open", classes: "bg-blue-100 text-blue-700" },
  planned: { label: "Planned", classes: "bg-purple-100 text-purple-700" },
  in_progress: {
    label: "In Progress",
    classes: "bg-yellow-100 text-yellow-700",
  },
  completed: { label: "Completed", classes: "bg-green-100 text-green-700" },
  declined: { label: "Declined", classes: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }: { status: FeatureStatus }) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
