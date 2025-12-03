/**
 * Product Service
 *
 * Handles fetching product data from the backend API.
 * Retrieves products filtered by category ID with error handling.
 */

import type { PaginatedProducts } from "@/models/EcommerceProps/ProductsProps";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

/**
 * Fetch all products for a specific category
 *
 * @param id - The category ID (string or number)
 * @returns Promise resolving to an array of product objects
 * @throws Returns empty array if request fails
 *
 * @example
 * const products = await fetchProductsByCategory('electronics')
 * console.log(products) // Array of product objects
 */
export async function fetchProductsByCategory(id: string | number) {
  // Ensure category ID is a number
  const categoryId = Number(id);

  try {
    // Get API URL from environment configuration
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    // Construct endpoint for category products
    const endpoint = `${apiUrl}/products/category/${categoryId}`;

    // Make GET request to fetch products
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Check for successful response
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    // Parse JSON response
    const data = await res.json();

    // Expected format: { message: "...", data: [...] }
    // Return data array, handling both array and single object responses
    return Array.isArray(data.data) ? data.data : [data.data];
  } catch (error: any) {
    // Log error with ALBA error handler (code 801 = external GET request error)
    handleInternalError("801", error.message || error);
    // Return empty array as fallback to prevent app crashes
    return [];
  }
}

/**
 * Fetch a single product by ID.
 *
 * @param id - Product ID (string or number)
 * @returns Promise resolving to product object OR null if fails
 *
 * @example
 * const product = await getProductById(4)
 * console.log(product) // { id: 4, title: "...", ... }
 */
export async function getProductById(id: string | number) {
  const productId = Number(id);

  try {
    // Load API URL from env
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API URL missing from environment variables");
    }

    // Build final endpoint
    const endpoint = `${apiUrl}/products/${productId}`;

    // Make the request
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    // Parse response
    const data = await res.json();

    // The backend returns:
    // { message: "...", data: { ...product } }
    return data?.data || null;
  } catch (error: any) {
    // Log with ALBA
    handleInternalError("802", error.message || error); // 802 = GET by ID error
    return null; // prevent app crash
  }
}

export async function fetchPaginatedProducts(page: number = 1, pageSize: number = 5): Promise<PaginatedProducts> {
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/products/paginated?page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    const json = await res.json();

    return {
      data: json.data || [],
      total: json.total || 0,
      totalPages: json.totalPages || 1,
      hasNext: json.hasNext ?? false,
      hasPrev: json.hasPrev ?? false,
    };
  } catch (error: any) {
    handleInternalError("802", error.message || error);
    console.error("Error en fetchPaginatedProducts:", error);

    return {
      data: [],
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }
}

/**
 * Fetch paginated products for a specific category
 * This calls the backend endpoint: /products/category/:categoryId?page=1&pageSize=5
 */
export async function fetchPaginatedProductsByCategory(
  categoryId: string | number,
  page: number = 1,
  pageSize: number = 5
): Promise<PaginatedProducts> {
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

    const res = await fetch(
      `${apiUrl}/products/category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error(`Error del backend: ${res.status}`);
    }

    const json = await res.json();

    // Some backends return `totalProducts` or `total` in their payload
    return {
      data: json.data || [],
      total: json.total ?? json.totalProducts ?? 0,
      totalPages: json.totalPages ?? 1,
      hasNext: json.hasNext ?? false,
      hasPrev: json.hasPrev ?? false,
    };
  } catch (error: any) {
    handleInternalError("802", error.message || error);
    console.error("Error en fetchPaginatedProductsByCategory:", error);

    return {
      data: [],
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  }
}

/**
 * Search products using backend search endpoint
 * Endpoint example: /products/search?pageSize=5&searchTerm=Freno&page=1
 */
export async function searchProducts(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 5
): Promise<{ success: boolean; data: any[]; total?: number; totalPages?: number; hasNextPage?: boolean; hasPrevPage?: boolean } | null> {
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL not configured");

    // Basic sanitization for query string
    const sanitized = encodeURIComponent(String(searchTerm).trim());

    const res = await fetch(`${apiUrl}/products/search?pageSize=${pageSize}&searchTerm=${sanitized}&page=${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Search API error: ${res.status}`);

    const json = await res.json();
    return json;
  } catch (error: any) {
    handleInternalError("803", error.message || error); // 803 = search error
    console.error("Error en searchProducts:", error);
    return null;
  }
}

/**
 * Search products within a specific category using backend endpoint
 * Example: /products/category/search?category=1&searchTerm=Carbono&page=1&pageSize=10
 */
export async function searchProductsByCategory(
  categoryId: string | number,
  searchTerm: string,
  page: number = 1,
  pageSize: number = 5
): Promise<{ success: boolean; data: any[]; total?: number; totalPages?: number; hasNextPage?: boolean; hasPrevPage?: boolean } | null> {
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL not configured");

    const sanitized = encodeURIComponent(String(searchTerm).trim());
    const cat = Number(categoryId);

    const res = await fetch(`${apiUrl}/products/category/search?category=${cat}&searchTerm=${sanitized}&page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Search by category API error: ${res.status}`);

    const json = await res.json();
    return json;
  } catch (error: any) {
    handleInternalError("804", error.message || error); // 804 = category search error
    console.error("Error en searchProductsByCategory:", error);
    return null;
  }
}