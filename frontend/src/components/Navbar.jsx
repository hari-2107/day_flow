import React from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title = "Dashboard", subtitle = "Welcome back!", toggleMobileSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
        <Link to="/notifications" className="notification-btn" aria-label="Notifications" style={{ position: "relative", color: "#64748b", textDecoration: "none" }}>
          <Bell size={20} />
          <span className="notification-badge" style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ef4444", color: "#fff", fontSize: "10px", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </Link>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}