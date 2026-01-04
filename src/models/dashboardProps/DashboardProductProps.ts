export type Products = Product[];

export interface Product {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  img_url?: string | null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}
