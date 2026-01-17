/**
 * Dashboard Categories Service
 *
 * Provides functions for managing product categories via the dashboard API.
 * Includes fetching paginated lists, creating, updating, and deleting categories.
 */
import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";
import type { Category } from "@/models/dashboardProps/DashboardCategoriesProps";

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch a paginated list of categories for the dashboard
 *
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Categories per page (default: 10)
 * @returns {Promise<CategoriesResponse | null>} Paginated categories data or null if fails
 */
export async function fetchCategories(
  page = 1,
  pageSize = 10
): Promise<CategoriesResponse | null> {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/categories?page=${page}&pageSize=${pageSize}`;

    const res = await AlbaClient.get(endpoint);
    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Create a new category
 *
 * @param {Partial<Category>} category - Category data to save
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveCategory(category: Partial<Category>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/categories`;

    const res = await AlbaClient.post(endpoint, category);
    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Update an existing category
 *
 * @param {Partial<Category>} category - Updated category data (must include ID)
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveCategoryUpdate(category: Partial<Category>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/categories/update`;

    const res = await AlbaClient.post(endpoint, category);
    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Delete a category by ID
 *
 * @param {string} id - ID of the category to delete
 * @returns {Promise<any>} Response data or null if fails
 */
export async function deleteCategory(id: string) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/categories/delete`;

    const res = await AlbaClient.post(endpoint, { id });
    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
