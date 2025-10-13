// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize user from localStorage if token exists
  // useEffect(() => {
  //   const savedToken = localStorage.getItem("token");
  //   if (savedToken) {
  //     setToken(savedToken);
  //     getMe({ token: savedToken })
  //       .then((res) => {
  //         setUser(res.data);
  //       })
  //       .catch(() => {
  //         localStorage.removeItem("token");
  //         setToken(null);
  //       })
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  const login = async (email: string, password: string) => {
    // try {
    //   setLoading(true);
    //   const res = await loginApi({ email, password });
    //   const authToken = res.data.token;
    //   localStorage.setItem("token", authToken);
    //   setToken(authToken);
    //   // Fetch current user
    //   const me = await getMe({ token: authToken });
    //   setUser(me.data);
    //   toast.success("Logged in successfully!");
    //   navigate("/dashboard");
    // } catch (error: any) {
    //   toast.error(error.message || "Login failed");
    //   throw error;
    // } finally {
    //   setLoading(false);
    // }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // navigate("/login");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
