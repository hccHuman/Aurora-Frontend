/**
 * Category Service
 *
 * Handles all category-related API communications with the backend.
 * Responsible for fetching the list of product categories.
 */

import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

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
    // Get API URL from environment variables (PUBLIC_API_URL or fallback to process.env)
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    // Construct endpoint URL for categories list
    const endpoint = `${apiUrl}/categories`;

    // Make GET request to fetch all categories
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // Check if response is successful
    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    // Parse JSON response
    const data = await res.json();

    // Return the data array from the response (format: { message: "...", data: [...] })
    return data.data;
  } catch (error: any) {
    // Log error using ALBA error handler (code 801 = external fetch GET error)
    handleInternalError("801", error.message || error);

    // Return empty array as fallback to prevent app crashes
    return [];
  }
}

export async function fetchPaginatedCategories(page = 1, pageSize = 10) {
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    const endpoint = `${apiUrl}/categories/paginated?page=${page}&pageSize=${pageSize}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    const json = await res.json();

    return {
      data: json.data || [],
      total: json.total || 0,
      totalPages: json.totalPages || 1,
    };
  } catch (error: any) {
    handleInternalError("801", error.message || error);
    return { items: [], pagination: null };
  }
}
