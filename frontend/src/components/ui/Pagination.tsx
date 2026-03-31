import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  count: number;
  pageSize?: number;
}

export function Pagination({ count, pageSize = 20 }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(page));
    }
    setSearchParams(next);
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
