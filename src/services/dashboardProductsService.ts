/**
 * Dashboard Products Service
 *
 * Provides functions for managing products via the dashboard API.
 * Includes fetching paginated lists, creating, updating, and deleting products.
 */
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";
import type { Product } from "@/models/dashboardProps/DashboardProductProps";

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch a paginated list of products for the dashboard
 *
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Products per page (default: 10)
 * @returns {Promise<ProductsResponse | null>} Paginated products data or null if fails
 */
export async function fetchProducts(
  page = 1,
  pageSize = 10
): Promise<ProductsResponse | null> {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/products?page=${page}&pageSize=${pageSize}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Products error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Create a new product
 *
 * @param {Partial<Product>} product - Product data to save
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveProduct(product: Partial<Product>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/products`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      throw new Error(`Save product error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Update an existing product
 *
 * @param {Partial<Product>} product - Updated product data (must include ID)
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveProductUpdate(product: Partial<Product>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/products/update`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      throw new Error(`Save product error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Delete a product by ID
 *
 * @param {string} id - ID of the product to delete
 * @returns {Promise<any>} Response data or null if fails
 */
export async function deleteProduct(id: string) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/products/delete`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error(`Delete product error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
