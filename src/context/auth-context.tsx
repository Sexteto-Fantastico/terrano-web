import { createContext, useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { setAuthDependencies } from "../lib/axios";

interface AuthContextValue {
  token: string | null;
  mustResetPassword: boolean;
  setToken: Dispatch<SetStateAction<string | null>>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [mustResetPassword, setMustResetPassword] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setMustResetPassword(false);
  }, []);

  setAuthDependencies({
    getAuthToken: () => token,
    onUnauthorized: logout,
  });

  return (
    <AuthContext.Provider
      value={{
        token,
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
