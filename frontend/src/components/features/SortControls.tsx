import { useSearchParams } from "react-router-dom";
import { Flame, Clock } from "lucide-react";

export function SortControls() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get("sort") || "top";

  const setSort = (sort: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", sort);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="flex gap-1 rounded-lg border border-gray-200 p-1 bg-white">
      <SortButton
        active={current === "top"}
        onClick={() => setSort("top")}
        icon={<Flame size={14} />}
        label="Top"
      />
      <SortButton
        active={current === "newest"}
        onClick={() => setSort("newest")}
        icon={<Clock size={14} />}
        label="Newest"
      />
    </div>
  );
}

function SortButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
