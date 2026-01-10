/**
 * Dashboard Categories Service
 *
 * Provides functions for managing product categories via the dashboard API.
 * Includes fetching paginated lists, creating, updating, and deleting categories.
 */
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

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Categories error: ${res.status}`);
    }

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

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      throw new Error(`Save category error: ${res.status}`);
    }

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

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(category),
    });

    if (!res.ok) {
      throw new Error(`Save category error: ${res.status}`);
    }

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

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error(`Delete category error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
