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
  const [employeeUnreadCount, setEmployeeUnreadCount] = useState(3);
  const [adminUnreadCount, setAdminUnreadCount] = useState(4);

  useEffect(() => {
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
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("dayflow_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        employeeUnreadCount,
        setEmployeeUnreadCount,
        adminUnreadCount,
        setAdminUnreadCount,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}