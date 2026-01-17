/**
 * HeaderSearch Component
 *
 * A global search input for the application header.
 * Performs debounced searches and updates the shared search state atom.
 * Connects to the ProductService for data fetching.
 *
 * @component
 */

import React, { useEffect, useRef, useState } from 'react';
import { searchProducts } from '@/services/productService';
import { useAtom } from 'jotai';
import { searchStateAtom } from '@/store/searchStore';

/**
 * Sanitizes search terms by removing potentially dangerous HTML characters.
 *
 * @param {string} s - Raw search string
 * @returns {string} Sanitized search string
 */
function sanitizeForSearch(s: string) {
  return s.replace(/[<>"'`]/g, '').trim();
}

/**
 * Props for the HeaderSearch component
 */
interface HeaderSearchProps {
  /** Accessibility placeholder text */
  placeholder?: string;
  /** Accessibility label for the search input */
  ariaLabel?: string;
  /** Number of results to fetch per page */
  pageSize?: number;
  /** Optional category ID to filter search (handled by page logic) */
  categoryId?: number | null;
}

export default function HeaderSearch({
  placeholder = "Buscar productos",
  ariaLabel = "Search products",
  pageSize = 5,
  categoryId = null,
  id = "search-input",
}: HeaderSearchProps & { id?: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  // no local dropdown used: search results are stored in the shared atom
  const timer = useRef<number | null>(null);

  const [, setSearchState] = useAtom(searchStateAtom);

  // M.A.R.I.A Integration: Listen for proactive search triggers
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const term = (e as CustomEvent).detail;
      if (term) {
        setQuery(term);
        doSearch(term);
      }
    };

    window.addEventListener("aurora-trigger-search", handleTrigger);

    // Check for query params on mount (for navigation-based search)
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }

    return () => window.removeEventListener("aurora-trigger-search", handleTrigger);
  }, []); // Run on mount

  useEffect(() => {
    // Only activate/search on the AllProducts page: /products/allproducts
    if (!window || !window.location) return;
    if (!window.location.pathname.includes("/products/allproducts")) return;
  }, []);

  const doSearch = async (term: string) => {
    const sanitized = sanitizeForSearch(term);
    if (!sanitized) {
      // clear global search state
      setSearchState({ query: "", results: [] });
      return;
    }

    // If this search input was rendered for a specific category (categoryId present)
    // we don't fetch global search results here. Instead we publish the query into
    // the shared atom and let the category page component perform the category-specific search
    if (categoryId !== null && categoryId !== undefined) {
      setSearchState({ query: sanitized, results: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await searchProducts(sanitized, 1, pageSize);
    setLoading(false);
    if (!res) {
      // update the shared search atom so other components can react
      setSearchState({ query: sanitized, results: [] });
      return;
    }

    const hits = res.data || [];

    // Always update shared search atom so product grid below reacts live
    setSearchState({ query: sanitized, results: hits });

    // Update shared search atom so product grid below reacts live
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => doSearch(v), 300);
  };

  // When the input receives focus (tap on mobile), trigger a live search
  const onFocus = async () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (query && query.trim().length > 0) {
      // For category-specific search, just update the shared query and let the list component fetch
      if (categoryId !== null && categoryId !== undefined) {
        const sanitized = sanitizeForSearch(query);
        setSearchState({ query: sanitized, results: [] });
        return;
      }

      // search without opening any dropdown
      await doSearch(query);
    }
  };

  // No local dropdown results; modal opening happens from product cards below

  return (
    <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
      <input
        id={id}
        name="q"
        value={query}
        onChange={onChange}
        onFocus={onFocus}
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded px-2 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600"
      />

      {/* Dropdown removed — search runs live and updates the page's product grid */}
    </div>
  );
}
