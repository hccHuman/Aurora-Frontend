import { useState, useEffect } from "react";
import CategoryCard from "@/components/tsx/CategoryCard/CategoryCard";
import Paginator from "@/components/tsx/Paginator/Paginator";
import { fetchPaginatedCategories } from "@/services/categoryService";
import { getResponsivePageSize } from "@/services/deviceService";
import type { Category } from "@/models/EcommerceProps/CategoryPaginationProps";

export default function CategoryListComponent({ lang }: Category) {
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(getResponsivePageSize());

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

  if (loading) return <p className="text-center my-8">Cargando categorías...</p>;

  return (
    <div className="flex flex-col w-full px-12">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-12">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} title={cat.nombre} img={cat.img_url} id={cat.id} lang={lang} />
        ))}
      </div>

      <Paginator initialPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
