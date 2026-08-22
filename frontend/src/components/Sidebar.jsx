import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCheck, 
  CalendarDays, 
  Clock, 
  IndianRupee, 
  Users, 
  CheckSquare,
  BarChart3,
  Bell,
  X
} from "lucide-react";

export default function Sidebar({ role = "Employee", user = { name: "Adhithya N", role: "Software Engineer", avatar: "" }, isOpen, onClose }) {
  const isAdmin = role === "Admin";

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? "show" : ""}`} 
        onClick={onClose} 
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">DF</div>
          <div className="sidebar-brand-name">Day<span>Flow</span></div>
          {onClose && (
            <button className="mobile-menu-btn" onClick={onClose} style={{ marginLeft: "auto", border: "none", background: "transparent" }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main Hub</div>
          
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
                <span>Attendance Log</span>
              </NavLink>
              <NavLink to="/employee/leave" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <CalendarDays size={18} />
                <span>Leave Management</span>
              </NavLink>
              <NavLink to="/employee/payroll" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <IndianRupee size={18} />
                <span>Payroll & Slips</span>
              </NavLink>
             <NavLink to="/employee/notifications" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
  <Bell size={18} />
  <span>Notifications</span>
</NavLink>
            </>
          ) : (
            <>
              <div className="sidebar-section-title">HR Management</div>
              <NavLink to="/admin/employees" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <Users size={18} />
                <span>Employee Directory</span>
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
                <IndianRupee size={18} />
                <span>Payroll Control</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
                <BarChart3 size={18} />
                <span>Analytics & Reports</span>
              </NavLink>
              <NavLink to="/admin/notifications" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
  <Bell size={18} />
  <span>Notifications</span>
</NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-content">
            {user?.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="sidebar-avatar-img" />
            ) : (
              <div className="avatar">{user?.name ? user.name.charAt(0) : "A"}</div>
            )}
            <div className="user-info">
              <strong>{user?.name || "Adhithya N"}</strong>
              <span>{user?.role || "Employee"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}