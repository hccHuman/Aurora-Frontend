import React, { useState, useEffect } from "react";
import Paginator from "./Paginator";
import { fetchPaginatedProducts } from "@/services/productService";
import { getResponsivePageSize } from "@/services/deviceService";
import { useAtom } from 'jotai';
import { searchStateAtom } from '@/store/searchStore';
import ProductCardComponent from "../ProductCard/ProductCardComponent";
import type { Product, AllProductsListProps } from "@/models/EcommerceProps/ProductsProps";

export default function AllProductsListComponent({
  lang = "es",
  onOpenModal,
}: AllProductsListProps) {
  const [searchState] = useAtom(searchStateAtom);

  const [products, setProducts] = useState<Product[]>(searchState?.results || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // pageSize NO puede calcularse en SSR → inicializamos con null para mantener
  // el mismo HTML en servidor y en cliente y dejamos que el efecto cliente lo calcule.
  const [pageSize, setPageSize] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  // 🔥 1) Calcular pageSize SOLO en el cliente
  useEffect(() => {
    const size = getResponsivePageSize();
    setPageSize(size);
  }, []);

  // 🔥 2) Cargar productos cuando tengamos pageSize
  const loadProducts = async (pageToLoad: number, size: number) => {
    setLoading(true);
    try {
      const res = await fetchPaginatedProducts(pageToLoad, size);
      const data = res?.data || [];
      const totalPages = res?.totalPages ?? 1;

      setProducts(data);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  // React to global header search state.

  // 🔥 3) Ejecutar carga SOLO si pageSize ya existe and there is no active search
  useEffect(() => {
    if (pageSize === null) return;

    // If a header search is currently active, skip paginated load
    if (searchState.query) return;

    loadProducts(page, pageSize);
  }, [page, pageSize, searchState.query]);

  useEffect(() => {
    // When there's an active query, display those results and skip paginated loads
    if (searchState.query && pageSize !== null) {
      setLoading(true);
      setProducts(searchState.results || []);
      setTotalPages(1);
      setLoading(false);
    } else if (!searchState.query && pageSize !== null) {
      // If search cleared, re-load paginated products
      loadProducts(page, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, pageSize]);

  // If no pageSize and no search is active, show config loader.
  if (pageSize === null && !searchState.query) {
    return <p className="text-center my-8">Cargando configuración...</p>;
  }

  // If loading and not currently showing search results, show loading UI.
  if (loading && !searchState.query) {
    return <p className="text-center my-8">Cargando productos...</p>;
  }

  return (
    <div className="flex flex-col w-full px-4">

      {/* GRID */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6 mb-12">
        {products.map((p) => (
          <ProductCardComponent
            key={p.id}
            id={p.id}
            title={p.nombre}
            description={p.descripcion}
            price={p.precio}
            img={p.img_url}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>

      {/* PAGINADOR */}
      <Paginator initialPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
