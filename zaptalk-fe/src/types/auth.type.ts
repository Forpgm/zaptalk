import type { SuccessResponse } from "./response.type";

export type AuthResponse = SuccessResponse<{
  message: string;
}>;
