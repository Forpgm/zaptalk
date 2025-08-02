import type { RegisterFormData } from "../components/auth/RegisterForm";
import type { AuthResponse } from "../types/auth.type";
import http from "../utils/http";

export const URL_REGISTER = "/auth/register";
export const URL_LOGOUT = "/auth/logout";
const authApi = {
  registerAccount: (body: RegisterFormData) =>
    http.post<AuthResponse>(URL_REGISTER, body),
  logout: () => http.post(URL_LOGOUT),
};
export default authApi;
