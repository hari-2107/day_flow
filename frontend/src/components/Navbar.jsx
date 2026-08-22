import React from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title = "Dashboard", subtitle = "Welcome back!", toggleMobileSidebar }) {
  const navigate = useNavigate();
  const { user, logout, employeeUnreadCount = 3, adminUnreadCount = 2 } = useAuth();

  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";
  const unreadCount = isAdmin ? adminUnreadCount : employeeUnreadCount;
  const notificationsPath = isAdmin ? "/admin/notifications" : "/employee/notifications";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {toggleMobileSidebar && (
          <button 
            type="button" 
            className="mobile-menu-btn" 
            onClick={toggleMobileSidebar}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="topbar-left">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link to={notificationsPath} className="notification-btn" aria-label="Notifications" style={{ position: "relative" }}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </Link>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}