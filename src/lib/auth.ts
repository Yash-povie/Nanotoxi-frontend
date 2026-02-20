"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const TOKEN_KEY = "access_token";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthContextType {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true); // Add loading state

  useEffect(() => {
    // Check for token on mount
    const storedToken = getCookie(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken as string);
    }
    setIsChecking(false);
  }, []);

  const login = (token: string) => {
    setCookie(TOKEN_KEY, token, { maxAge: 60 * 60 * 24 }); // 1 day
    setToken(token);
    router.push("/");
  };

  const logout = () => {
    deleteCookie(TOKEN_KEY);
    setToken(null);
    router.push("/login"); // Assuming you have a login page
  };

  // Return checking logic so components know to wait
  // If we are checking, we trigger isAuthenticated as undefined or we handle it in the return type?
  // Easier: Just return an isLoading flag from this hook.
  return { 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token,
      isLoading: isChecking // Expose loading state
  };
}

export function getAuthToken() {
  return getCookie(TOKEN_KEY);
}
