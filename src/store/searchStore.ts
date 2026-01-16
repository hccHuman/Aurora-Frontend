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
import { atomWithStorage } from 'jotai/utils';

/**
 * Search state atom used by HeaderSearch and AllProductsListComponent
 * Contains the current search query (string) and results (array)
 * Persisted in sessionStorage to survive page reloads during MARIA navigation.
 */
export const searchStateAtom = atomWithStorage('aurora_search_state', { query: '', results: [] as any[] });
