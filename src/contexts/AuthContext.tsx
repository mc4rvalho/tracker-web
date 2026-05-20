import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy Initialization
  const [user, setUser] = useState<User | null>(() => {
    const storagedUser = localStorage.getItem("@Tracker:user");
    const storagedToken = localStorage.getItem("@Tracker:token");

    if (storagedUser && storagedToken) {
      return JSON.parse(storagedUser);
    }
    return null;
  });

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });

    const { user, access_token } = response.data;

    localStorage.setItem("@Tracker:user", JSON.stringify(user));
    localStorage.setItem("@Tracker:token", access_token);

    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@Tracker:user");
    localStorage.removeItem("@Tracker:token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
