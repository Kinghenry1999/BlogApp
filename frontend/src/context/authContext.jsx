import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(null);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    setUser(null);
  };

 

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };