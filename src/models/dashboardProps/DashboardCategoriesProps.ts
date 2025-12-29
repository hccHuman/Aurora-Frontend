export interface Category {
  id: string;
  nombre: string;
  activo: boolean;
  lang?: string;
  title?: string;
  img?: string;
  actualizado_en?: string;
  creado_en?: string;
}

export interface CategoriesListProps {
  /** Título del bloque */
  title?: string;

  /** Página inicial */
  initialPage?: number;

  /** PageSize forzado (si no se pasa, usa getResponsivePageSize) */
  pageSizeOverride?: number;

  /** Modo solo lectura (oculta acciones) */
  readOnly?: boolean;

  /** Callback tras crear / editar */
  onSaved?: (categoryId: string) => void;

  /** Callback tras eliminar */
  onDeleted?: (categoryId: string) => void;
}