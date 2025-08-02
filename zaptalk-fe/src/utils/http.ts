import axios, { AxiosError, type AxiosInstance } from "axios";

class Http {
  private accessToken: string;
  private refreshToken: string;
  instance: AxiosInstance;
  constructor() {
    this.accessToken = "";
    this.refreshToken = "";
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_DEVELOPMENT_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;
export default http;
