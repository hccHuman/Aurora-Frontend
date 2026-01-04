export interface ProductCard {
  id: string;
  nombre: string;
  img_url: string;
  descripcion: string;
  precio: number;
}

export interface PaginatedProducts {
  data: any[];       // Array de productos
  total: number;     // Total de productos
  totalPages: number;// Total de páginas
  hasNext: boolean;  // Si hay siguiente página
  hasPrev: boolean;  // Si hay página anterior
}

export interface ProductCardProps {
  id: number;
  title: string;
  description?: string;
  price?: number;
  img: string;
  onOpenModal?: (id: number) => void;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  img_url: string;
}

export interface AllProductsListProps {
  lang?: string;
  onOpenModal?: (id: number) => void;
}