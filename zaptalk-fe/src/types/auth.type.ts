import type { SuccessResponse } from "./response.type";
import type { User } from "./user.type";

export type AuthResponse = SuccessResponse<{
  message: string;
}>;
export type VerifyEmailResponse = SuccessResponse<{
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}>;
