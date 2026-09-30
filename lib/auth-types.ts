export type UserRole = "OWNER" | "INSPECTOR";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  name?: string;
  exp?: number;
  iat?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
