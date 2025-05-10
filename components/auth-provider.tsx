"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { isSessionValid } from "@/lib/auth";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/register"];

interface AuthContextType {
  isAuthenticated: boolean;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  checkSession: () => false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar la sesión y redirigir si es necesario
  useEffect(() => {
    const checkAuthState = () => {
      const isValid = isSessionValid();
      setIsAuthenticated(isValid);

      // Si no es una ruta pública y no está autenticado, redirigir al login
      if (!publicRoutes.includes(pathname) && !isValid) {
        router.push("/login");
      }

      setIsLoading(false);
    };

    checkAuthState();

    // Verificar la sesión cada 30 segundos
    const interval = setInterval(checkAuthState, 30000);
    return () => clearInterval(interval);
  }, [pathname, router]);

  // Función para verificar la sesión manualmente
  const checkSession = () => {
    const isValid = isSessionValid();
    setIsAuthenticated(isValid);
    return isValid;
  };

  if (isLoading) {
    return null; // O un componente de carga
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}
