import type { VerifyEmailRequestBody } from "../components/auth/EmailVerifiedResult";
import type {
  RegisterResponse,
  LoginFormData,
  VerifyEmailResponse,
  RegisterFormData,
  LoginResponse,
  RefreshTokenRequestBody,
} from "../types/auth.type";
import http from "../utils/http";

export const URL_REGISTER = "/auth/register";
export const URL_LOGIN = "/auth/login";
export const URL_LOGOUT = "/auth/logout";
export const URL_VERIFY_EMAIL = "/auth/verify-email";
export const URL_REFRESH_TOKEN = "/auth/refresh-token";

const authApi = {
  registerAccount: (body: Omit<RegisterFormData, "confirm_password">) =>
    http.post<RegisterResponse>(URL_REGISTER, body),
  login: (body: LoginFormData) => http.post<LoginResponse>(URL_LOGIN, body),
  logout: () => http.post(URL_LOGOUT),
  verifyEmail: (body: VerifyEmailRequestBody) =>
    http.post<VerifyEmailResponse>(URL_VERIFY_EMAIL, body),
  refreshToken: (body: RefreshTokenRequestBody) =>
    http.post(URL_REFRESH_TOKEN, body),
};
export default authApi;
