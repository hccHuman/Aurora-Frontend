/**
 * Authentication and User Profile Models
 * 
 * Defines the payloads, responses, and profile structures
 * for the authentication system.
 */

/**
 * Data required for user login.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * response from a successful login attempt.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Data required for user registration.
 */
export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

/**
 * response from a successful registration attempt.
 */
export interface RegisterResponse {
  message: string;
  user: Profile;
}

/**
 * Basic user profile information.
 */
export interface Profile {
  id: string | number;
  nombre?: string;
  email?: string;
  /** Whether the user has administrative privileges */
  admin: boolean;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
  creado_en?: string;
  actualizado_en?: string;
}

/**
 * Props for authentication-related UI components.
 */
export interface Auth {
  /** Current language code */
  lang?: string;
}
