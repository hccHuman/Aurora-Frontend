import { motion, AnimatePresence } from 'framer-motion';

// src/components/ui/Pagination.tsx
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

/**
 * Pagination Component (Dashboard)
 *
 * A specialized pagination control for dashboard tables and lists.
 * Features animated page number transitions and standard "Previous/Next" navigation.
 *
 * @component
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4 overflow-hidden">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || disabled}
        className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
                   disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 transition-colors"
      >
        ← Previous
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={page}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium text-gray-700 dark:text-slate-200"
        >
          Page {page} of {totalPages}
        </motion.span>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || disabled}
        className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
                   disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 transition-colors"
      >
        Next →
      </motion.button>
    </div>
  );
}
