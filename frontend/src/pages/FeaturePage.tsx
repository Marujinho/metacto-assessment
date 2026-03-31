import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFeature } from "../hooks/useFeature";
import { useUpdateFeature } from "../hooks/useUpdateFeature";
import { useDeleteFeature } from "../hooks/useDeleteFeature";
import { FeatureDetail } from "../components/features/FeatureDetail";
import { FeatureForm } from "../components/features/FeatureForm";
import { ErrorState } from "../components/ui/ErrorState";
import { FeatureCardSkeleton } from "../components/features/FeatureCardSkeleton";
import { getErrorMessage } from "../lib/errorMessages";
import type { FeatureFormData } from "../types/feature";

export function FeaturePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: feature, isLoading, isError, error, refetch } = useFeature(slug);
  const updateFeature = useUpdateFeature(slug ?? "");
  const deleteFeature = useDeleteFeature();
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <FeatureCardSkeleton />
      </div>
    );
  }

  if (isError || !feature) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Feature not found."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Feature
        </h2>
        <FeatureForm
          feature={feature}
          submitLabel="Save changes"
          onSubmit={async (data: FeatureFormData) => {
            await updateFeature.mutateAsync(data);
            toast.success("Feature updated.");
            setEditing(false);
          }}
        />
        <button
          onClick={() => setEditing(false)}
          className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    try {
      await deleteFeature.mutateAsync(feature.slug);
      toast.success("Feature deleted.");
      navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const ownerControls = feature.is_owner ? (
    <div className="flex gap-2">
      <button
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Pencil size={14} />
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={deleteFeature.isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  ) : null;

  return <FeatureDetail feature={feature} ownerControls={ownerControls} />;
}
