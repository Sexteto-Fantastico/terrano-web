import { createContext, useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { setAuthDependencies } from "../lib/axios";

const STORAGE_KEY = "terrano_auth_token";
const EXPIRES_AT_KEY = "terrano_auth_expires_at";

interface AuthContextValue {
  token: string | null;
  mustResetPassword: boolean;
  setToken: (token: string | null, expiresAt?: string) => void;
  setMustResetPassword: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  mustResetPassword: false,
  setToken: () => {},
  setMustResetPassword: () => {},
  logout: () => {},
});

export type AuthState = Pick<
  AuthContextValue,
  "token" | "mustResetPassword" | "logout"
>;

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [tokenState, setTokenState] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (stored && expiresAt) {
      const expiresAtMs = Number(expiresAt);
      if (!Number.isNaN(expiresAtMs) && Date.now() < expiresAtMs) {
        return stored;
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    return null;
  });
  const [mustResetPassword, setMustResetPassword] = useState(false);

  const setToken = useCallback(
    (newToken: string | null, expiresAt?: string) => {
      if (newToken && expiresAt) {
        localStorage.setItem(STORAGE_KEY, newToken);
        localStorage.setItem(
          EXPIRES_AT_KEY,
          String(new Date(expiresAt).getTime())
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(EXPIRES_AT_KEY);
      }
      setTokenState(newToken);
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setMustResetPassword(false);
  }, [setToken]);

  setAuthDependencies({
    getAuthToken: () => tokenState,
    onUnauthorized: logout,
  });

  return (
    <AuthContext.Provider
      value={{
        token: tokenState,
        mustResetPassword,
        setToken,
        setMustResetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
