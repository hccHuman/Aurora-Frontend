export type Users = User[];
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  password_hash?: string; // ahora se muestra
  password?: string; // para enviar nueva password al backend
  ultimo_login?: string;
}
