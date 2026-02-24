"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgetPassword', '/products', '/categories', '/brands'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  //Safe localStorage access (client side only)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  //Protect routes based on authentication
  useEffect(() => {
    if (!loading) {
      const isAuth = !!token && !!userId;
      setIsAuthenticated(isAuth);

      //Redirect to login if trying to access protected route without auth
      if (!isAuth && !isPublicRoute && pathname !== '/login') {
        toast.error("Please login to access this page");
        router.push('/login');
      }

      // Redirect to home if trying to access login/register while authenticated
      if (isAuth && (pathname === '/login' || pathname === '/register')) {
        router.push('/');
      }
    }
  }, [loading, token, userId, pathname, router, isPublicRoute]);

  const login = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    
    toast.success("Logged in successfully!");
    
    // Redirect to home or previous page
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    router.push(redirectPath);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartId");
    localStorage.removeItem("shippingAddress");
    
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const checkAuth = () => {
    return !!token && !!userId;
  };

  if (loading) {
    // Show nothing while checking authentication
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      userId, 
      isAuthenticated,
      login, 
      logout,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};