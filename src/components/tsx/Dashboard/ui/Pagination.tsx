// src/components/ui/Pagination.tsx
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || disabled}
        className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <span className="text-sm text-gray-500 dark:text-slate-400">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || disabled}
        className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
