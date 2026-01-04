import type { Pagination } from "@/models/EcommerceProps/PaginationProps";
import { useState } from "react";

export default function Paginator({
  initialPage = 1,
  totalPages,
  onPageChange,
}: Pagination) {
  const [page, setPage] = useState(initialPage);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    onPageChange(p); // Emitimos el evento hacia Astro
  };

  return (
    <div className="flex justify-center gap-4 my-8">
      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
      >
        ← Anterior
      </button>

      <span className="font-medium">
        {page} de {totalPages}
      </span>

      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
}
