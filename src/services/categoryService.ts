/**
 * Category Service
 *
 * Handles all category-related API communications with the backend.
 * Responsible for fetching the list of product categories.
 */

import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";

/**
 * Fetch all product categories from the backend API
 *
 * @async
 * @returns {Promise<Array>} Array of category objects with properties: id, nombre, img_url
 * @throws {Error} Returns empty array if request fails (error is logged)
 *
 * Expected backend response format:
 * {
 *   message: "Categories retrieved successfully",
 *   data: [
 *     { id: 1, nombre: "Electronics", img_url: "..." },
 *     { id: 2, nombre: "Clothing", img_url: "..." },
 *     ...
 *   ]
 * }
 */
export async function fetchCategories() {
  try {
    // Get API URL from environment variables
    const apiUrl = PUBLIC_API_URL;

    // Construct endpoint URL for categories list
    const endpoint = `${apiUrl}/categories`;

    // Make GET request to fetch all categories
    const res = await AlbaClient.get(endpoint);

    // Parse JSON response
    const data = await res.json();

    // Return the data array from the response (format: { message: "...", data: [...] })
    return data.data;
  } catch (error: any) {
    // Log error using ALBA error handler (code 801 = external fetch GET error)
    handleInternalError(error);

    // Return empty array as fallback to prevent app crashes
    return [];
  }
}

/**
 * Fetch a paginated list of product categories
 *
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Number of categories per page (default: 10)
 * @returns {Promise<Object>} Object containing data array and pagination metadata
 *
 * @example
 * const { data, total } = await fetchPaginatedCategories(1, 5);
 */
export async function fetchPaginatedCategories(page = 1, pageSize = 10) {
  try {
    const apiUrl = PUBLIC_API_URL;

    const endpoint = `${apiUrl}/categories/paginated?page=${page}&pageSize=${pageSize}`;

    const res = await AlbaClient.get(endpoint);

    const json = await res.json();

    return {
      data: json.data || [],
      total: json.total || 0,
      totalPages: json.totalPages || 1,
    };
  } catch (error: any) {
    handleInternalError(error);
    return { data: [], total: 0, totalPages: 1 };
  }
}
