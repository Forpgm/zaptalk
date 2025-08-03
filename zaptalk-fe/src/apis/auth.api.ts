import type { VerifyEmailRequestBody } from "../components/auth/EmailVerifiedResult";
import type { RegisterFormData } from "../components/auth/RegisterForm";
import type { AuthResponse, VerifyEmailResponse } from "../types/auth.type";
import http from "../utils/http";

export const URL_REGISTER = "/auth/register";
export const URL_LOGOUT = "/auth/logout";
export const URL_VERIFY_EMAIL = "/auth/verify-email";
const authApi = {
  registerAccount: (body: RegisterFormData) =>
    http.post<AuthResponse>(URL_REGISTER, body),
  logout: () => http.post(URL_LOGOUT),
  verifyEmail: (body: VerifyEmailRequestBody) =>
    http.post<VerifyEmailResponse>(URL_VERIFY_EMAIL, body),
};
export default authApi;
