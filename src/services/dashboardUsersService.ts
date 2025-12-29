import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import type { User } from "@/models/dashboardProps/DashboardUsersProps";

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

/* 👤 GET users (paginado) */
export async function fetchUsers(
  page = 1,
  pageSize = 10
): Promise<UsersResponse | null> {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("840", error.message || error);
    return null;
  }
}

/* ➕➖ CREATE / UPDATE */
export async function saveUser(user: Partial<User>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("841", error.message || error);
    return null;
  }
}

export async function saveUserUpdate(user: Partial<User>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("841", error.message || error);
    return null;
  }
}

/* 🗑 DELETE */
export async function deleteUser(id: string) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("842", error.message || error);
    return null;
  }
}
