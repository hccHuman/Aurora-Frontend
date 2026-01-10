/**
 * Dashboard Users Service
 *
 * Provides functions for managing users via the dashboard API.
 * Includes fetching paginated lists, creating, updating, and deleting users.
 */
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { PUBLIC_API_URL } from "@/utils/envWrapper";
import type { User } from "@/models/dashboardProps/DashboardUsersProps";

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch a paginated list of users for the dashboard
 *
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Users per page (default: 10)
 * @returns {Promise<UsersResponse | null>} Paginated users data or null if fails
 */
export async function fetchUsers(
  page = 1,
  pageSize = 10
): Promise<UsersResponse | null> {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/users?page=${page}&pageSize=${pageSize}`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Users error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Create a new user (admin level)
 *
 * @param {Partial<User>} user - User data to save
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveUser(user: Partial<User>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/users`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error(`Save user error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Update an existing user's details
 *
 * @param {Partial<User>} user - Updated user data (must include ID)
 * @returns {Promise<any>} Response data or null if fails
 */
export async function saveUserUpdate(user: Partial<User>) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/users/update`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error(`Save user error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}

/**
 * Delete a user by ID
 *
 * @param {string} id - ID of the user to delete
 * @returns {Promise<any>} Response data or null if fails
 */
export async function deleteUser(id: string) {
  try {
    const apiUrl = PUBLIC_API_URL;
    const endpoint = `${apiUrl}/api/stats/users/delete`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error(`Delete user error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    handleInternalError(error);
    return null;
  }
}
