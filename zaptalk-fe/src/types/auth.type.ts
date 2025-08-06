import type { SuccessResponse } from "./response.type";
import type { User } from "./user.type";

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export type RegisterResponse = SuccessResponse<{
  message: string;
}>;

export type LoginResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
  session_id: string;
  user: User;
}>;

export type VerifyEmailResponse = SuccessResponse<{
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}>;

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
}>;

export interface RefreshTokenRequestBody {
  session_id: string;
}
