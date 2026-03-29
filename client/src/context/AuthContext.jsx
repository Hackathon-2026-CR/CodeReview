import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/api/users/login", { username, password });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.detail?.error || "Invalid credentials",
      );
    }

    const data = await response.json();

    setUser(data.user);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("username", data.user.username);
    // ✅ token optionnel — stocke seulement s'il existe
    if (data.token) localStorage.setItem("token", data.token);
    navigate("/");
  };
  const register = async (name, password, email) => {
    const response = await api.post("/api/users/add-user", {
      name,
      password,
      email,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    // ✅ Auto-login après register
    await login(name, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
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
