"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const TOKEN_KEY = "access_token";
const USER_KEY = "user_details";

interface UserDetails {
  username: string;
  name: string;
  designation: string;
}

interface AuthContextType {
  token: string | null;
  user: UserDetails | null;
  login: (token: string, user: UserDetails) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthContextType {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for token and user on mount
    const storedToken = getCookie(TOKEN_KEY);
    const storedUser = getCookie(USER_KEY);
    
    if (storedToken) {
      setToken(storedToken as string);
    }
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser as string);
        if (parsedUser && typeof parsedUser === 'object') {
             setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user details", e);
      }
    }
    setIsChecking(false);
  }, []);

  const login = (token: string, userDetails: UserDetails) => {
    // 1. Save to cookies/state
    setCookie(TOKEN_KEY, token, { maxAge: 60 * 60 * 24 }); // 1 day
    setCookie(USER_KEY, JSON.stringify(userDetails), { maxAge: 60 * 60 * 24 });
    setToken(token);
    setUser(userDetails);

    // 2. Update Login History in LocalStorage
    try {
        const historyStr = localStorage.getItem("login_history");
        let history = historyStr ? JSON.parse(historyStr) : [];
        
        // Add new entry
        const newEntry = {
            name: userDetails.name,
            role: userDetails.designation,
            timestamp: Date.now(),
            device: "Chrome / Windows" // Mock device for now
        };

        // Prepend and limit to 10
        history = [newEntry, ...history].slice(0, 10);
        localStorage.setItem("login_history", JSON.stringify(history));
    } catch (e) {
        console.error("Failed to update login history", e);
    }

    router.push("/");
  };

  const logout = () => {
    deleteCookie(TOKEN_KEY);
    deleteCookie(USER_KEY);
    setToken(null);
    setUser(null);
    router.push("/login"); // Assuming you have a login page
  };

  return { 
      token, 
      user,
      login, 
      logout, 
      isAuthenticated: !!token,
      isLoading: isChecking // Expose loading state
  };
}

export function getAuthToken() {
  return getCookie(TOKEN_KEY);
}
