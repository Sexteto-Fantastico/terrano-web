import { env } from "@/env";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, refreshSession } from "@/lib/auth-session";

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// A 401 on these routes is an expected answer (wrong credentials, dead cookie...), not an expired session.
const PUBLIC_AUTH_ROUTES = [
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
];

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retried ||
      PUBLIC_AUTH_ROUTES.some((route) => config.url?.startsWith(route))
    ) {
      throw error;
    }

    config._retried = true;

    try {
      const session = await refreshSession();
      if (session) {
        config.headers.Authorization = `Bearer ${session.token}`;
        return api(config);
      }
    } catch {
      // Network failure while refreshing: keep the original 401 for the caller.
      throw error;
    }

    onUnauthorized?.();
    throw error;
  }
);

export default api;
