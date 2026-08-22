import React from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ title = "Dashboard", subtitle = "Welcome back!", toggleMobileSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("dayflow_user");
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

      <div className="topbar-right">
        <Link to="/notifications" className="notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </Link>

        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}