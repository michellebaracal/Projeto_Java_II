import React, { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "./authContextDeclaration";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token")
  );
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  const login = (jwt: string) => {
    localStorage.setItem("jwt_token", jwt);
    setToken(jwt);
    navigate("/projects");
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
