// core/auth/types/user.types.ts

export type UserRole =
  | "superadmin"
  | "admin"
  | "seller"
  | "user";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullname?: string;
  avatar?: string | null;
  role: UserRole;
  storeSlug?: string | null;
}

export interface RegisterState {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree?: boolean;
}

export interface LoginState {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface FieldErrors {
  fullname?: string;
  username?: string;
  email?: string;
  identifier?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
  general?: string;
}