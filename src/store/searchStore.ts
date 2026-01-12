/**
 * Search Global State Store
 *
 * Jotai atom for managing search queries and results across the application.
 * Used by HeaderSearch and AllProductsListComponent to synchronize search state.
 *
 * @example
 * const [search, setSearch] = useAtom(searchStateAtom);
 * setSearch({ query: 'laptop', results: [...] });
 */
import { atom } from 'jotai';

/**
 * Search state atom used by HeaderSearch and AllProductsListComponent
 * Contains the current search query (string) and results (array)
 */
export const searchStateAtom = atom({ query: '', results: [] as any[] });
