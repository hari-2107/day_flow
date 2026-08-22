import React, { createContext, useContext, useState, useEffect } from "react";
import { profileService } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("dayflow_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Error reading saved user:", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, verify profile with backend on app launch
    if (user?.token) {
      profileService.getProfile()
        .then((res) => {
          if (res.data?.user) {
            const freshUser = { ...user, ...res.data.user };
            setUser(freshUser);
            localStorage.setItem("dayflow_user", JSON.stringify(freshUser));
          }
        })
        .catch((err) => {
          console.warn("Session validation failed or server unreachable:", err?.message);
        });
    }
  }, []);

  const login = (userData, token) => {
    const fullUser = {
      ...userData,
      token: token || userData.token
    };
    setUser(fullUser);
    localStorage.setItem("dayflow_user", JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dayflow_user");
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem("dayflow_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}