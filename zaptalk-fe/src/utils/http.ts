import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from "axios";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_VERIFY_EMAIL,
} from "../apis/auth.api";
import { clearLocalStorage, setAccessTokenToLocalStorage } from "./auth";
import { toast } from "react-toastify";
import type { ErrorResponse } from "../types/response.type";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./errors";
import type { LoginResponse, RefreshTokenResponse } from "../types/auth.type";
import { useAuthStore } from "./store";
import { CloudHail } from "lucide-react";

class Http {
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  instance: AxiosInstance;
  constructor() {
    this.accessToken = "";
    this.refreshToken = "";
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_DEVELOPMENT_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_VERIFY_EMAIL) {
          const data = response.data as LoginResponse;

          // 1. Set tokens
          this.accessToken = data.data.access_token;
          this.refreshToken = data.data.refresh_token;

          // 2. Set Zustand
          useAuthStore
            .getState()
            .setAuthenticated(
              data.data.user,
              data.data.access_token,
              data.data.stream_token,
              data.data.session_id
            );
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLocalStorage();
        }
        return response;
      },
      (error: AxiosError) => {
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status as number)
        ) {
          const message = error.message;
          toast.error(message, { position: "top-center" });
        }

        if (
          isAxiosUnauthorizedError<
            ErrorResponse<{
              name: string;
              message: string;
            }>
          >(error)
        ) {
          const config = error.response?.config || { headers: {}, url: "" };
          const { url } = config;
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // xóa request sau 10s
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((access_token: string) => {
              // gọi lại request cũ
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: access_token },
              });
            });
          }

          toast.error(error.message || error.response?.data.message);
          clearLocalStorage();
          this.accessToken = "";
        }
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.request.use(
      (config) => {
        console.log("access token: ", this.accessToken);
        if (this.accessToken) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  private async handleRefreshToken() {
    console.log(123);
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken,
      })
      .then((response) => {
        this.accessToken = (
          response.data as RefreshTokenResponse
        ).data.access_token;
        setAccessTokenToLocalStorage(this.accessToken);
        return this.accessToken;
      })
      .catch((error) => {
        clearLocalStorage();
        this.accessToken = "";
        throw error;
      });
  }
}
const http = new Http().instance;
export default http;
