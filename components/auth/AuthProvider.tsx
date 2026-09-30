"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { User, LoginDto, RegisterDto, AuthResponse } from "@/lib/auth-types";
import {
  saveAuthSession,
  clearAuthSession,
  restoreAuthSession,
} from "@/lib/auth-storage";
import { authApi } from "@/lib/apiClient";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<User | null>;
  register: (userData: RegisterDto) => Promise<User | null>;
  logout: () => void;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  loginError: string | null;
  registerError: string | null;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const router = useRouter();

  // Restore session from cookie / storage on mount
  useEffect(() => {
    const { user: restoredUser } = restoreAuthSession();
    if (restoredUser) {
      setUser(restoredUser);
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => authApi.register(userData),
  });

  const redirectToDashboard = (role: string) => {
    if (role === "OWNER") {
      router.push("/owner/dashboard");
    } else if (role === "INSPECTOR") {
      router.push("/inspector/dashboard");
    } else {
      router.push("/login");
    }
  };

  const login = async (credentials: LoginDto): Promise<User | null> => {
    setLoginError(null);
    try {
      const response: AuthResponse = await loginMutation.mutateAsync(credentials);
      const authenticatedUser = saveAuthSession(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        response.user?.name
      );

      if (authenticatedUser) {
        setUser(authenticatedUser);
        redirectToDashboard(authenticatedUser.role);
        return authenticatedUser;
      }
      throw new Error("Unable to decode user session from credentials.");
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password.";
      setLoginError(msg);
      throw err;
    }
  };

  const register = async (userData: RegisterDto): Promise<User | null> => {
    setRegisterError(null);
    try {
      const response: AuthResponse = await registerMutation.mutateAsync(userData);
      const authenticatedUser = saveAuthSession(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
        userData.name || response.user?.name
      );

      if (authenticatedUser) {
        setUser(authenticatedUser);
        redirectToDashboard(authenticatedUser.role);
        return authenticatedUser;
      }
      throw new Error("Unable to process user registration.");
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please check your details.";
      setRegisterError(msg);
      throw err;
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    router.push("/login");
  };

  const clearErrors = () => {
    setLoginError(null);
    setRegisterError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        isLoginLoading: loginMutation.isPending,
        isRegisterLoading: registerMutation.isPending,
        loginError,
        registerError,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
