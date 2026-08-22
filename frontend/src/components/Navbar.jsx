import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  LogOut, 
  Menu, 
  Check, 
  CheckCheck, 
  Calendar, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  CheckSquare, 
  AlertTriangle, 
  UserPlus, 
  FileText 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title = "Dashboard", subtitle = "Welcome back!", toggleMobileSidebar, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, employeeUnreadCount, setEmployeeUnreadCount, adminUnreadCount, setAdminUnreadCount } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Determine active role
  const isAdmin = 
    role === "Admin" || 
    location.pathname.startsWith("/admin") || 
    user?.role === "Admin";

  const unreadCount = isAdmin ? adminUnreadCount : employeeUnreadCount;

  // Role-specific notifications data
  const [employeeNotifications, setEmployeeNotifications] = useState([
    {
      id: 1,
      title: "Salary Slip Released (August 2026)",
      message: "August 2026 payslip has been credited to your HDFC bank account.",
      time: "2h ago",
      icon: IndianRupee,
      color: "success",
      read: false
    },
    {
      id: 2,
      title: "Leave Request Approved",
      message: "Casual Leave request for Aug 28 - Aug 29 approved by HR.",
      time: "Yesterday",
      icon: Calendar,
      color: "info",
      read: false
    },
    {
      id: 3,
      title: "Attendance Logged",
      message: "Today's check-in recorded at 09:02 AM.",
      time: "Today",
      icon: Clock,
      color: "warning",
      read: false
    },
    {
      id: 4,
      title: "Security Notice",
      message: "New workspace login detected from Chrome (Chennai).",
      time: "3d ago",
      icon: ShieldAlert,
      color: "primary",
      read: true
    }
  ]);

  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: 1,
      title: "New Leave Application",
      message: "Adhithya N (EMP-1042) requested 2 days Casual Leave.",
      time: "15m ago",
      icon: CheckSquare,
      color: "info",
      read: false
    },
    {
      id: 2,
      title: "Attendance Anomaly",
      message: "2 staff members clocked in past 09:30 AM buffer.",
      time: "1h ago",
      icon: AlertTriangle,
      color: "warning",
      read: false
    },
    {
      id: 3,
      title: "Staff Onboarding",
      message: "Vikram Seth joined Engineering team (EMP-1046).",
      time: "Yesterday",
      icon: UserPlus,
      color: "success",
      read: false
    },
    {
      id: 4,
      title: "Payroll Statement Ready",
      message: "Reconciliation sheets ready for 48 staff members.",
      time: "2d ago",
      icon: FileText,
      color: "primary",
      read: false
    }
  ]);

  const activeNotifications = isAdmin ? adminNotifications : employeeNotifications;

  // Toggle Bell Dropdown
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    if (isAdmin) {
      setAdminNotifications(adminNotifications.map(n => ({ ...n, read: true })));
      setAdminUnreadCount(0);
    } else {
      setEmployeeNotifications(employeeNotifications.map(n => ({ ...n, read: true })));
      setEmployeeUnreadCount(0);
    }
  };

  // Mark a single notification as read
  const handleSingleRead = (id) => {
    if (isAdmin) {
      const updated = adminNotifications.map(n => n.id === id ? { ...n, read: true } : n);
      setAdminNotifications(updated);
      setAdminUnreadCount(updated.filter(n => !n.read).length);
    } else {
      const updated = employeeNotifications.map(n => n.id === id ? { ...n, read: true } : n);
      setEmployeeNotifications(updated);
      setEmployeeUnreadCount(updated.filter(n => !n.read).length);
    }
  };

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

      <div className="topbar-right">
        {/* Toggle Notification Wrapper */}
        <div className="notification-dropdown-wrap" ref={dropdownRef}>
          <button 
            type="button" 
            className={`notification-btn ${isOpen ? "active" : ""}`} 
            onClick={handleToggle}
            aria-label="Toggle notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {/* Floating Dropdown Panel */}
          {isOpen && (
            <div className="notification-dropdown-menu">
              <div className="dropdown-header">
                <div>
                  <h4>{isAdmin ? "HR Alerts" : "Notifications"}</h4>
                  <span className="dropdown-sub">{unreadCount} unread</span>
                </div>
                <button 
                  type="button" 
                  className="dropdown-mark-all" 
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={14} />
                  <span>Mark all read</span>
                </button>
              </div>

              <div className="dropdown-list">
                {activeNotifications.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div key={item.id} className={`dropdown-item ${!item.read ? "unread" : ""}`}>
                      <div className={`dropdown-icon-box ${item.color}`}>
                        <IconComp size={16} />
                      </div>
                      <div className="dropdown-content">
                        <div className="dropdown-item-header">
                          <strong className="dropdown-item-title">{item.title}</strong>
                          <span className="dropdown-item-time">{item.time}</span>
                        </div>
                        <p className="dropdown-item-msg">{item.message}</p>
                      </div>
                      {!item.read && (
                        <button 
                          type="button" 
                          className="dropdown-check-btn"
                          title="Mark read"
                          onClick={() => handleSingleRead(item.id)}
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}