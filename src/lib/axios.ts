import { env } from "@/env";
import axios from "axios";

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});

let getAuthToken: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthDependencies({
  getAuthToken: getToken,
  onUnauthorized: handleUnauthorized,
}: {
  getAuthToken: () => string | null;
  onUnauthorized: () => void;
}) {
  getAuthToken = getToken;
  onUnauthorized = handleUnauthorized;
}

api.interceptors.request.use((config) => {
  const token = getAuthToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    throw error;
  }
);

export default api;
