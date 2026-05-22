import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if it exists
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  const navigate = useNavigate();

  const login = (userData, accessToken) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    
    // Route based on role
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/employee");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
