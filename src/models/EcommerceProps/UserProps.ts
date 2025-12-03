export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;     
  user: Profile;     
}

export interface Profile {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
}

export interface Auth {
  lang?: string;
}
