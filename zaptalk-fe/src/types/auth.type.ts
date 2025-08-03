import type { SuccessResponse } from "./response.type";

export type AuthResponse = SuccessResponse<{
  message: string;
}>;
export type VerifyEmailResponse = SuccessResponse<{
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    username: string;
    phone_number: string;
  };
}>;
