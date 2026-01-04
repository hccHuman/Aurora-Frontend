import { atom } from 'jotai';

/**
 * Search state atom used by HeaderSearch and AllProductsListComponent
 * Contains the current search query (string) and results (array)
 */
export const searchStateAtom = atom({ query: '', results: [] as any[] });
