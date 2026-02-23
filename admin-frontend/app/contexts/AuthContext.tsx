"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingScreen from "../components/LoadingScreen";
import { authApi } from "@/lib/api";

interface User {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("chakra_admin_token");
      if (!token) {
        return false;
      }

      // Verify token with backend
      const response = await authApi.verify();

      if (response.success && response.admin) {
        const loginTime =
          localStorage.getItem("loginTime") || new Date().toISOString();
        setUser({
          email: response.admin.email,
          name: "Admin User",
          role: "Super Admin",
          loginTime,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
      return false;
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.token) {
        const loginTime = new Date().toISOString();

        localStorage.setItem("loginTime", loginTime);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        setUser({
          email,
          name: "Admin User",
          role: "Super Admin",
          loginTime,
        });
        setIsAuthenticated(true);

        // Immediately redirect to dashboard after successful login
        router.push("/dashboard");

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem("loginTime");
    localStorage.removeItem("rememberMe");

    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login if not already there
    if (pathname !== "/login") {
      router.push("/login");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const isAuth = await checkAuth();
      setIsLoading(false);

      // Redirect logic
      if (!isAuth && !publicRoutes.includes(pathname)) {
        router.push("/login");
      } else if (isAuth && pathname === "/login") {
        router.push("/dashboard");
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkSession = async () => {
      try {
        await authApi.verify();
      } catch (error) {
        console.error("Session expired:", error);
        logout();
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
