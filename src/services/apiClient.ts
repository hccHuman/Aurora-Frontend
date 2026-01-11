/**
 * API Client Service
 *
 * Provides a base HTTP client for making authenticated requests to the backend API.
 * Handles common request configuration, error handling, and token management.
 */

import { PUBLIC_API_URL } from "@/utils/envWrapper";

/**
 * Make an authenticated HTTP request to the backend API
 *
 * @param endpoint - The API endpoint path (e.g., '/users', '/products')
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise resolving to the parsed JSON response
 * @throws Error if the request fails
 *
 * @example
 * const data = await apiCall('/categories', {
 *   method: 'GET',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * })
 */
export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  // Get base API URL from environment configuration
  const baseURL =
    typeof window !== "undefined" && (window as any).ENV?.API_URL
      ? (window as any).ENV.API_URL
      : PUBLIC_API_URL;

  // Construct full URL
  const url = `${baseURL}${endpoint}`;

  // Set default headers for JSON communication
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    // Make the HTTP request with provided options
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse JSON response
    const data = await response.json();

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${data.message || "Unknown error"}`);
    }

    return data;
  } catch (error: any) {
    // Log error for debugging
    console.error("API Client Error:", error.message);
    // Re-throw the error for caller to handle
    throw error;
  }
}
