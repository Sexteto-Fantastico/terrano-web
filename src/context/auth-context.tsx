import { createContext, useState, useCallback, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { isAxiosError } from "axios";
import { setUnauthorizedHandler } from "../lib/axios";
import {
  broadcastLogout,
  getSession,
  onRemoteLogout,
  refreshSession,
  serverLogout,
  setSession,
  subscribeSession,
  toSession,
  type Session,
} from "@/lib/auth-session";
import { queryClient } from "@/lib/react-query";
import { getMe } from "@/api/auth";
import { getMyPermissions, type User } from "@/api/users";
import { flattenPermissions, can, type PermissionsMap } from "@/lib/permissions";

const PERMISSIONS_REFRESH_INTERVAL_MS = 60_000;
const REFRESH_MARGIN_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

interface AuthContextValue {
  token: string | null;
  user: User | null;
  permissions: PermissionsMap | null;
  mustResetPassword: boolean;
  /** True once the session was restored and, when there is one, the user and permissions are loaded. */
  isReady: boolean;
  /** True after the first attempt to restore the session from the refresh cookie. */
  isBootstrapped: boolean;
  authError: string | null;
  can: (resource: string, action: string) => boolean;
  setToken: (token: string | null, expiresAt?: string) => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  updateUser: (user: User) => void;
  reload: () => void;
  logout: () => void;
  isLoggingOut: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  permissions: null,
  mustResetPassword: false,
  isReady: false,
  isBootstrapped: false,
  authError: null,
  isLoggingOut: false,
  can: () => false,
  setToken: () => {},
  setUser: () => {},
  updateUser: () => {},
  reload: () => {},
  logout: () => {},
});

export type AuthState = Pick<
  AuthContextValue,
  "token" | "user" | "mustResetPassword" | "isReady" | "logout" | "can"
>;

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, setSessionState] = useState<Session | null>(getSession);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [userState, setUserState] = useState<User | null>(null);
  const [permissionsState, setPermissionsState] =
    useState<PermissionsMap | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const loggingOutRef = useRef(false);
  const lastLoadRef = useRef(0);

  const hasSession = session !== null;
  // Identity data of a previous session must never leak into the next one.
  const user = hasSession ? userState : null;
  const permissions = hasSession ? permissionsState : null;

  useEffect(() => subscribeSession(setSessionState), []);

  // Restores the session from the httpOnly refresh cookie (page load / new tab).
  useEffect(() => {
    let active = true;
    refreshSession()
      .catch(() => null)
      .finally(() => {
        if (active) setIsBootstrapped(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setToken = useCallback((newToken: string | null, expiresAt?: string) => {
    if (newToken && expiresAt) {
      if (!getSession()) {
        setUserState(null);
        setPermissionsState(null);
      }
      setSession(toSession({ token: newToken, expiresAt }));
    } else {
      setSession(null);
    }
  }, []);

  const updateUser = useCallback((updated: User) => {
    setUserState(updated);
  }, []);

  const logout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    setIsLoggingOut(true);
    broadcastLogout();
    await serverLogout();
    setSession(null);
    queryClient.clear();
    window.location.href = "/sign-in";
  }, []);

  const loadIdentity = useCallback(async (silent: boolean) => {
    try {
      const [me, permissionsData] = await Promise.all([
        getMe(),
        getMyPermissions(),
      ]);
      setUserState(me);
      setPermissionsState(flattenPermissions(permissionsData));
      setAuthError(null);
      lastLoadRef.current = Date.now();
    } catch (error) {
      // A 401 was already handled by the axios interceptor (refresh or logout).
      if (isAxiosError(error) && error.response?.status === 401) return;
      if (!silent) {
        setAuthError("Não foi possível carregar os dados da sua conta.");
      }
    }
  }, []);

  const reload = useCallback(() => {
    setAuthError(null);
    void loadIdentity(false);
  }, [loadIdentity]);

  useEffect(() => {
    if (hasSession && !userState) {
      void loadIdentity(false);
    }
    // Only a new session needs a first load; later token rotations keep the identity.
  }, [hasSession, userState, loadIdentity]);

  // Silent renewal shortly before the access token expires.
  const expiresAt = session?.expiresAt;
  useEffect(() => {
    if (!expiresAt) return;
    const delay = Math.max(
      expiresAt - Date.now() - REFRESH_MARGIN_MS,
      MIN_REFRESH_DELAY_MS,
    );
    const timer = setTimeout(() => {
      refreshSession()
        .then((renewed) => {
          if (!renewed) void logout();
        })
        .catch(() => {
          // Temporary network failure: the next request refreshes lazily.
        });
    }, delay);
    return () => clearTimeout(timer);
  }, [expiresAt, logout]);

  // Picks up permission changes made by an administrator without requiring a new login.
  useEffect(() => {
    if (!hasSession) return;
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastLoadRef.current > PERMISSIONS_REFRESH_INTERVAL_MS
      ) {
        void loadIdentity(true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [hasSession, loadIdentity]);

  // Logout in another tab ends this session too.
  useEffect(
    () =>
      onRemoteLogout(() => {
        setSession(null);
        queryClient.clear();
        window.location.href = "/sign-in";
      }),
    [],
  );

  useEffect(() => {
    setUnauthorizedHandler(() => void logout());
  }, [logout]);

  const isReady =
    isBootstrapped && (!hasSession || (user !== null && permissions !== null));

  return (
    <AuthContext.Provider
      value={{
        token: session?.token ?? null,
        user,
        permissions,
        mustResetPassword: user?.requiresPasswordReset ?? false,
        isReady,
        isBootstrapped,
        authError,
        can: (resource: string, action: string) =>
          can(permissions, resource, action),
        setToken,
        setUser: setUserState,
        updateUser,
        reload,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
