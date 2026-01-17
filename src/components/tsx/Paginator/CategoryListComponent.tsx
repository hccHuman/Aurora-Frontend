import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCard from "@/components/tsx/CategoryCard/CategoryCard";
import CategoryCardSkeleton from "@/components/tsx/CategoryCard/CategoryCardSkeleton";
import Paginator from "@/components/tsx/Paginator/Paginator";
import { fetchPaginatedCategories } from "@/services/categoryService";
import { getResponsivePageSize } from "@/services/deviceService";
import type { Category } from "@/models/EcommerceProps/CategoryPaginationProps";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * CategoryListComponent Component
 *
 * Displays a paginated grid of product categories.
 * Fetches data from CategoryService and handles responsive page sizing.
 * Uses framer-motion stagger animations for the category cards.
 *
 * @component
 */
export default function CategoryListComponent({ lang = "es" }: Category) {
  const t = useYOLI(lang);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number | null>(null);

  const loadCategories = async (pageToLoad: number, size: number) => {
    setLoading(true);
    try {
      const { data, totalPages } = await fetchPaginatedCategories(pageToLoad, size);
      setCategories(data);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setCategories([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    const size = getResponsivePageSize(); // aquí sí existe window
    setPageSize(size);
    loadCategories(page, size);
  }, [page]);

  // Show skeletons while loading
  if (loading || pageSize === null) {
    return (
      <div className="flex flex-col w-full px-12 flex-1">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-12">
          {Array.from({ length: pageSize || 8 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-12 flex-1">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-12"
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} title={cat.nombre} img={cat.img_url} id={cat.id} lang={lang} />
        ))}
      </motion.div>

      <Paginator initialPage={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
    </div>
  );
}
