import { handleInternalError } from "@/modules/ALBA/ErrorHandler";
import type { Product } from "@/models/dashboardProps/DashboardProductProps";

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/* 📦 GET products (paginado) */
export async function fetchProducts(
  page = 1,
  pageSize = 10
): Promise<ProductsResponse | null> {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("830", error.message || error);
    return null;
  }
}

/* ➕➖ CREATE / UPDATE */
export async function saveProduct(product: Partial<Product>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("831", error.message || error);
    return null;
  }
}

export async function saveProductUpdate(product: Partial<Product>) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("831", error.message || error);
    return null;
  }
}


/* 🗑 DELETE */
export async function deleteProduct(id: string) {
  try {
    const apiUrl =
      import.meta.env.PUBLIC_API_URL || process.env.PUBLIC_API_URL;

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
    handleInternalError("832", error.message || error);
    return null;
  }
}
