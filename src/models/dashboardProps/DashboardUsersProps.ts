/**
 * Dashboard User Models
 * 
 * Defines the structure for user management within the 
 * administrative dashboard.
 */

/**
 * A collection of users.
 */
export type Users = User[];

/**
 * Represents a single user account in the dashboard context.
 */
export interface User {
  id: string;
  /** Full name of the user */
  nombre: string;
  /** Email address used for login */
  email: string;
  /** ID representing the user's role (optional, use admin boolean instead) */
  rol_id?: number;
  /** Whether the user has admin privileges */
  admin: boolean;
  /** Whether the account is active */
  activo: boolean;
  /** Creation timestamp */
  creado_en: string;
  /** Last update timestamp */
  actualizado_en: string;
  /** Password hash for administrative display/edit (optional) */
  password_hash?: string;
  /** New password field for account updates */
  password?: string;
  /** Timestamp of the last successful login */
  ultimo_login?: string;
}
