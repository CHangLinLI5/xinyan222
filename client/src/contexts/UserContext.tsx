/**
 * 芯颜 AI — User Context
 * Manages user authentication state with localStorage persistence
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface UserProfile {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  skinType: string;
  joinDate: string;
  totalTests: number;
  avgScore: number;
}

interface UserContextValue {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "xinyan_user";

const DEFAULT_AVATAR = "data:image/svg+xml," + encodeURIComponent(`
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="60" fill="#EDE8E0"/>
  <circle cx="60" cy="48" r="18" fill="rgba(193,123,92,0.15)" stroke="#C17B5C" stroke-width="2"/>
  <path d="M28 100C28 82 42 70 60 70C78 70 92 82 92 100" stroke="#C17B5C" stroke-width="2" stroke-linecap="round"/>
</svg>
`);

function generateUser(phone: string): UserProfile {
  const masked = phone.slice(0, 3) + "****" + phone.slice(-4);
  return {
    id: `user-${Date.now()}`,
    phone,
    nickname: `用户${phone.slice(-4)}`,
    avatar: DEFAULT_AVATAR,
    skinType: "混合偏干",
    joinDate: new Date().toISOString().split("T")[0],
    totalTests: 23,
    avgScore: 79,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((phone: string) => {
    setUser(generateUser(phone));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
