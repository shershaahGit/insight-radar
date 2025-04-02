
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, AuthState } from "@/lib/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuthState({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
