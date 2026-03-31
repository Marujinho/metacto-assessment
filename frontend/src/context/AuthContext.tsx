import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api";
import { queryKeys } from "../hooks/queryKeys";
import type { RegisterData, User } from "../types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    api.get("/csrf/");
  }, []);

  const { data: user = null, isLoading } = useQuery<User | null>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const res = await api.get("/me/");
        return res.data;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });

  const login = useCallback(
    async (username: string, password: string) => {
      await api.post("/login/", { username, password });
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await api.post("/logout/");
    queryClient.setQueryData(queryKeys.auth.me, null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] === "auth",
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.features.all });
  }, [queryClient]);

  const register = useCallback(async (data: RegisterData) => {
    await api.post("/register/", data);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
