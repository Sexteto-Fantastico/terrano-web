import { createContext, useState, useCallback, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { setAuthDependencies } from "../lib/axios";
import { getUserById, getMyPermissions, type User } from "@/api/users";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { flattenPermissions, can, type PermissionsMap } from "@/lib/permissions";

const STORAGE_KEY = "terrano_auth_token";
const EXPIRES_AT_KEY = "terrano_auth_expires_at";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  permissions: PermissionsMap | null;
  mustResetPassword: boolean;
  can: (resource: string, action: string) => boolean;
  setToken: (token: string | null, expiresAt?: string) => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  updateUser: (user: User) => void;
  setMustResetPassword: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  isLoggingOut: boolean;
}

interface TerranoJwtPayload extends JwtPayload {
  id?: number;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  permissions: null,
  mustResetPassword: false,
  isLoggingOut: false,
  can: () => false,
  setToken: () => {},
  setUser: () => {},
  updateUser: () => {},
  setMustResetPassword: () => {},
  logout: () => {},
  
});

export type AuthState = Pick<
  AuthContextValue,
  "token" | "user" | "mustResetPassword" | "logout"
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
  const [userState, setUserState] = useState<User | null>(null);
  const [permissionsState, setPermissionsState] = useState<PermissionsMap | null>(null);
  const [mustResetPassword, setMustResetPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const updateUser = useCallback((user: User) => {
    setUserState(user);
  }, []);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    setToken(null);
    setUserState(null);
    setPermissionsState(null);
    setMustResetPassword(false);
    window.location.href = "/sign-in";
  }, [setToken, setUserState, setMustResetPassword]);

  useEffect(() => {
    const fetchUser = async (token: string) => {
      try {
        const decoded = jwtDecode<TerranoJwtPayload>(token);
        const userId = decoded.id || decoded.sub;
        if (userId) {
          const [user, permissionsData] = await Promise.all([
            getUserById(Number(userId)),
            getMyPermissions().catch(() => null),
          ]);
          setUserState(user);
          setPermissionsState(flattenPermissions(permissionsData ?? undefined));
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        logout();
      }
    };

    if (tokenState) {
      fetchUser(tokenState);
    } else {
      queueMicrotask(() => {
        setUserState(null);
        setPermissionsState(null);
      });
    }
  }, [tokenState, logout]);

  setAuthDependencies({
    getAuthToken: () => tokenState,
    onUnauthorized: logout,
  });

  return (
    <AuthContext.Provider
      value={{
        token: tokenState,
        user: userState,
        permissions: permissionsState,
        mustResetPassword,
        can: (resource: string, action: string) => can(permissionsState, resource, action),
        setToken,
        setUser: setUserState,
        updateUser,
        setMustResetPassword,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
