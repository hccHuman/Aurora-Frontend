import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import type { Category } from "@/models/dashboardProps/DashboardCategoriesProps";

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  totalPages: number;
}

/* 🗂 GET categories (paginado) */
export async function fetchCategories(
  page = 1,
  pageSize = 10
): Promise<CategoriesResponse | null> {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("850", error.message || error);
    return null;
  }
}

/* ➕➖ CREATE / UPDATE */
export async function saveCategory(category: Partial<Category>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("851", error.message || error);
    return null;
  }
}

export async function saveCategoryUpdate(category: Partial<Category>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("851", error.message || error);
    return null;
  }
}


/* 🗑 DELETE */
export async function deleteCategory(id: string) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("852", error.message || error);
    return null;
  }
}
