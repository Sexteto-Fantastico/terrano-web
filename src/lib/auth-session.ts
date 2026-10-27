import axios, { isAxiosError } from "axios";
import { env } from "@/env";

export interface Session {
  token: string;
  /** Epoch in milliseconds. */
  expiresAt: number;
}

type Listener = (session: Session | null) => void;

// The access token only lives in memory; the refresh token is an httpOnly cookie managed by the API.
let current: Session | null = null;
const listeners = new Set<Listener>();

const channel =
  typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel("terrano-auth");

// Plain client without interceptors, used for the calls that must never trigger a refresh.
export const authClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});

export function getAccessToken(): string | null {
  return current?.token ?? null;
}

export function getSession(): Session | null {
  return current;
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSession(session: Session | null) {
  current = session;
  listeners.forEach((listener) => listener(session));
}

export function toSession(response: {
  token: string;
  expiresAt: string;
}): Session {
  return {
    token: response.token,
    expiresAt: new Date(response.expiresAt).getTime(),
  };
}

export function broadcastLogout() {
  channel?.postMessage("logout");
}

export function onRemoteLogout(handler: () => void): () => void {
  if (!channel) return () => {};
  const listener = (event: MessageEvent) => {
    if (event.data === "logout") handler();
  };
  channel.addEventListener("message", listener);
  return () => channel.removeEventListener("message", listener);
}

// Rotation invalidates the previous cookie, so concurrent refreshes (several tabs) must be serialized.
async function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks) {
    return navigator.locks.request("terrano-refresh", task);
  }
  return task();
}

let refreshing: Promise<Session | null> | null = null;

/**
 * Exchanges the refresh cookie for a new access token (single flight).
 * Resolves to null when there is no valid session; rejects on network failures.
 */
export function refreshSession(): Promise<Session | null> {
  refreshing ??= runExclusive(async () => {
    try {
      const { data } = await authClient.post<{
        token: string;
        expiresAt: string;
      }>("/auth/refresh");
      const session = toSession(data);
      setSession(session);
      return session;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        [401, 403].includes(error.response.status)
      ) {
        setSession(null);
        return null;
      }
      throw error;
    }
  }).finally(() => {
    refreshing = null;
  });

  return refreshing;
}

export async function serverLogout() {
  try {
    await authClient.post("/auth/logout");
  } catch {
    // The local session is dropped anyway; the refresh token expires on its own.
  }
}
