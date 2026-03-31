import { Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SortControls } from "../components/features/SortControls";
import { FeatureList } from "../components/features/FeatureList";
import { FeatureForm } from "../components/features/FeatureForm";
import { useRequireAuth } from "../hooks/useRequireAuth";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [showForm, setShowForm] = useState(false);
  const { requireAuth } = useRequireAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {search ? `Results for "${search}"` : "Feature Requests"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vote on the features you want to see built.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SortControls />
          <button
            onClick={() => requireAuth(() => setShowForm(!showForm))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New feature
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Submit a Feature Request
          </h2>
          <FeatureForm />
        </div>
      )}

      <FeatureList />
    </div>
  );
}
