// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

 
  const login = (userObj) => {
  setUser(userObj);
  localStorage.setItem("token", userObj.token); // ✅ Use userObj.token instead of response.data.token
  localStorage.setItem("user", JSON.stringify(userObj)); // ✅ Optional: Save user object too
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  const token = user?.token || null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
