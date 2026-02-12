"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
// import { Session } from "@supabase/supabase-js"; // Removed dependency
import { supabase } from "./supabase";

interface AuthContextType {
  session: any | null;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Stubbed auth: Providing a mock developer user for stability
    const mockUser = {
      id: "dev-user-id",
      email: "dev@example.com",
      user_metadata: { display_name: "Developer" }
    };

    setSession({ user: mockUser });
    setUser(mockUser);
    setLoading(false);

    // Supabase auth listeners removed for stability
    return () => { };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Mock login called:", email);
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    console.log("Mock signup called:", email, displayName);
  };

  const logout = async () => {
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        login,
        signup,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
