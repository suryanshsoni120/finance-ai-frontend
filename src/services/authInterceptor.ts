import type { InternalAxiosRequestConfig } from "axios";

export function authInterceptor(config: InternalAxiosRequestConfig) {
  if (config.url?.includes("/health")) {
    return config;
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
