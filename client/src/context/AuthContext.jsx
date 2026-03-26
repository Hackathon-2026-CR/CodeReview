import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("username");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/api/tasks/login", { username, password });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail?.error || "Invalid credentials");
    }

    const data = await response.json();

    setUser(data.user);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("username", data.user.username);
    navigate("/");
  };

  const register = async (name, password, email) => {
    const response = await api.post("/api/tasks/add-user", {
      name,
      password,
      email,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    // After register, auto-login
    await login(name, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
