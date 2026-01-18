import type { Pagination } from "@/models/EcommerceProps/PaginationProps";
import { useState } from "react";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * Paginator Component
 *
 * A reusable pagination control with "Previous" and "Next" buttons.
 * Displays current page and total page count.
 * Communicates page changes back to the parent via the `onPageChange` callback.
 *
 * @component
 */
export default function Paginator({
  initialPage = 1,
  totalPages,
  onPageChange,
  lang = "es"
}: Pagination & { lang?: string }) {
  const t = useYOLI(lang);
  const [page, setPage] = useState(initialPage);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    onPageChange(p); // Emitimos el evento hacia Astro
  };

  return (
    <nav className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 my-8 px-2" aria-label="Pagination">
      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label={t("pagination.aria.go_previous")}
      >
        ← {t("pagination.previous")}
      </button>

      <span className="font-medium flex items-center" aria-current="page">
        {page} {t("pagination.of")} {totalPages}
      </span>

      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label={t("pagination.aria.go_next")}
      >
        {t("pagination.next")} →
      </button>
    </nav>
  );
}
