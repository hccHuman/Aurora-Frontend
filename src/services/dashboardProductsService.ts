/**
 * Dashboard Products Service
 *
 * Provides functions for managing products via the dashboard API.
 * Includes fetching paginated lists, creating, updating, and deleting products.
 */
import { AlbaClient } from "@/modules/ALBA/AlbaClient";
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

    const res = await AlbaClient.get(endpoint);
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

    const res = await AlbaClient.post(endpoint, product);
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

    const res = await AlbaClient.post(endpoint, product);
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

    const res = await AlbaClient.post(endpoint, { id });
    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
