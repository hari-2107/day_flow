import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCheck, 
  CalendarDays, 
  Clock, 
  DollarSign, 
  Users, 
  CheckSquare,
  BarChart3,
  Bell,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role, user: userProp, isOpen, onClose }) {
  const { user: authUser } = useAuth();
  const currentUser = userProp || authUser || { name: "User", role: "Employee" };
  const currentRole = role || currentUser.role || "EMPLOYEE";
  const isAdmin = (currentRole || "").toUpperCase() === "ADMIN";

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? "show" : ""}`} 
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="sidebar-logo">DF</div>
            <div className="sidebar-brand-name">Day<span>Flow</span></div>
          </div>
          {onClose && (
            <button 
              className="mobile-menu-btn" 
              onClick={onClose} 
              style={{ border: "none", background: "transparent" }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Menu</div>
          
          <NavLink 
            to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"} 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          {!isAdmin ? (
            <>
              <div className="sidebar-section-title">Self Service</div>
              <NavLink to="/employee/profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <UserCheck size={18} />
                <span>My Profile</span>
              </NavLink>
              <NavLink to="/employee/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <Clock size={18} />
                <span>Attendance</span>
              </NavLink>
              <NavLink to="/employee/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <CalendarDays size={18} />
                <span>Leave Requests</span>
              </NavLink>
              <NavLink to="/employee/payroll" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <DollarSign size={18} />
                <span>My Payroll</span>
              </NavLink>
              <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <Bell size={18} />
                <span>Notifications</span>
              </NavLink>
            </>
          ) : (
            <>
              <div className="sidebar-section-title">HR Management</div>
              <NavLink to="/admin/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <Users size={18} />
                <span>Employees</span>
              </NavLink>
              <NavLink to="/admin/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <Clock size={18} />
                <span>All Attendance</span>
              </NavLink>
              <NavLink to="/admin/leaves" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <CheckSquare size={18} />
                <span>Leave Approvals</span>
              </NavLink>
              <NavLink to="/admin/payroll" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <DollarSign size={18} />
                <span>Payroll Control</span>
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <BarChart3 size={18} />
                <span>Analytics & Reports</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-content" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {(currentUser.name || "U").charAt(0)}
            </div>
            <div className="user-info">
              <strong style={{ display: "block", fontSize: "14px" }}>{currentUser.name}</strong>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{currentUser.role || currentUser.designation}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}