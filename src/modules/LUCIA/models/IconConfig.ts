export interface IconConfig {
  id: string; // ID del <img> en el DOM
  name: string; // nombre del icono, usado para la ruta
  path?: string; // ruta base alternativa, opcional
}

export type Theme = "light" | "dark";
