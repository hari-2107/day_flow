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
  Bell
} from "lucide-react";

export default function Sidebar({ role = "Employee", user = { name: "Alex Morgan", role: "Software Engineer" } }) {
  const isAdmin = role === "Admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">DF</div>
        <div className="sidebar-brand-name">Day<span>Flow</span></div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main Menu</div>
        
        <NavLink 
          to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"} 
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {!isAdmin ? (
          <>
            <div className="sidebar-section-title">Self Service</div>
            <NavLink to="/employee/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Clock size={18} />
              <span>Attendance</span>
            </NavLink>
            <NavLink to="/employee/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <CalendarDays size={18} />
              <span>Leave Requests</span>
            </NavLink>
            <NavLink to="/employee/payroll" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <DollarSign size={18} />
              <span>My Payroll</span>
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Bell size={18} />
              <span>Notifications</span>
            </NavLink>
          </>
        ) : (
          <>
            <div className="sidebar-section-title">HR Management</div>
            <NavLink to="/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Users size={18} />
              <span>Employees</span>
            </NavLink>
            <NavLink to="/employee/attendance" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Clock size={18} />
              <span>All Attendance</span>
            </NavLink>
            <NavLink to="/employee/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <CheckSquare size={18} />
              <span>Leave Approvals</span>
            </NavLink>
            <NavLink to="/payroll" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <DollarSign size={18} />
              <span>Payroll Control</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <BarChart3 size={18} />
              <span>Analytics & Reports</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-content">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="user-info">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}