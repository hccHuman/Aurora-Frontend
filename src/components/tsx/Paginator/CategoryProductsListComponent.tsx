import React, { useState, useEffect } from "react";
import Paginator from "./Paginator";
import { fetchPaginatedProductsByCategory, searchProductsByCategory } from "@/services/productService";
import { useAtom } from 'jotai';
import { searchStateAtom } from '@/store/searchStore';
import { getResponsivePageSize } from "@/services/deviceService";
import ProductCardComponent from "../ProductCard/ProductCardComponent";
import type { Product } from "@/models/EcommerceProps/ProductsProps";
import { t } from "@/modules/YOLI/injector";

interface Props {
  categoryId: number;
  lang?: string;
}

/**
 * CategoryProductsListComponent Component
 *
 * Displays a paginated grid of products belonging to a specific category.
 * Also supports category-scoped search queries from the global search store.
 *
 * @component
 */
export default function CategoryProductsListComponent({ categoryId, lang = "es" }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchState] = useAtom(searchStateAtom);

  useEffect(() => {
    const size = getResponsivePageSize();
    setPageSize(size);
  }, []);

  const loadProducts = async (pageToLoad: number, size: number) => {
    setLoading(true);
    try {
      const { data, totalPages } = await fetchPaginatedProductsByCategory(categoryId, pageToLoad, size);
      setProducts(data);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error cargando productos de categoría:", err);
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (pageSize === null) return;

    // If a search query is active in the shared atom, use the category search API instead
    const q = (searchState && searchState.query) ? String(searchState.query).trim() : '';

    if (q && q.length > 0) {
      // perform category-scoped search
      const loadSearch = async () => {
        setLoading(true);
        try {
          const res = (await searchProductsByCategory(categoryId, q, page, pageSize as number)) as any;
          if (res && Array.isArray(res.data)) {
            setProducts(res.data);
            setTotalPages(res.totalPages ?? Math.ceil((res.total ?? res.totalProducts ?? res.data.length) / (pageSize as number)));
          } else {
            setProducts([]);
            setTotalPages(1);
          }
        } catch (err) {
          console.error('Error cargando búsqueda por categoría', err);
          setProducts([]);
          setTotalPages(1);
        }
        setLoading(false);
      };

      loadSearch();
      return;
    }

    // default paginated listing
    loadProducts(page, pageSize);
  }, [page, pageSize, categoryId, searchState?.query]);

  // Reset to first page when the search query changes (new search)
  useEffect(() => {
    const q = (searchState && searchState.query) ? String(searchState.query).trim() : '';
    if (q && page !== 1) setPage(1);
  }, [searchState?.query, categoryId]);

  if (pageSize === null) return <p className="text-center my-8">{t("products.loading_config", lang)}</p>;
  if (loading) return <p className="text-center my-8">{t("products.loading_products", lang)}</p>;

  return (
    <div className="flex flex-col w-full px-4">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-12">
        {products.map((p) => (
          <ProductCardComponent
            key={p.id}
            id={p.id}
            title={p.nombre}
            description={p.descripcion}
            price={p.precio}
            img={p.img_url}
            category_id={p.product_category || categoryId}
            lang={lang}
          />
        ))}
      </div>

      <Paginator initialPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
