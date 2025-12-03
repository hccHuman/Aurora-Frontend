// src/services/categoryService.ts
import { ENV } from "@/config";
import { handleInternalError } from "@/modules/ALBA/ErrorHandler";

export async function fetchCategories(): Promise<
  { id: number; nombre: string; img_url: string }[]
> {
  try {
    const res = await fetch(`${ENV.API_URL}/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Error del backend: ${res.status}`);
    const data = await res.json();
    return data.data || []; // ⚡ Devuelve solo el array
  } catch (error: any) {
    handleInternalError("801", error.message || error);
    return [];
  }
}
