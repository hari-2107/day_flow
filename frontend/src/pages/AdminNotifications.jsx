import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Bell, CheckCheck, UserPlus, FileText, AlertTriangle, CheckSquare, Check } from "lucide-react";

export default function AdminNotifications() {
  const { user, setAdminUnreadCount } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Leave Request Submitted",
      message: "Adhithya N (EMP-1042) submitted a Casual Leave application for August 28 - 29.",
      time: "15 mins ago",
      icon: CheckSquare,
      color: "info",
      read: false
    },
    {
      id: 2,
      title: "Attendance Anomaly Flagged",
      message: "2 employees arrived past the 09:30 AM buffer time today.",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "warning",
      read: false
    },
    {
      id: 3,
      title: "New Employee Onboarded",
      message: "Vikram Seth has joined Engineering as Full Stack Developer (EMP-1046).",
      time: "Yesterday",
      icon: UserPlus,
      color: "success",
      read: false
    },
    {
      id: 4,
      title: "Payroll Cycle Ready for Approval",
      message: "August 2026 salary reconciliation sheets generated for 48 active staff.",
      time: "2 days ago",
      icon: FileText,
      color: "primary",
      read: false
    }
  ]);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setAdminUnreadCount(0);
  };

  const toggleSingleRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    const remaining = updated.filter(n => !n.read).length;
    setAdminUnreadCount(remaining);
  };

  const activeUnread = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={user || { name: "Aadhavan Raman", role: "HR Administrator" }} />
      <main className="dashboard-main">
        <Navbar role="Admin" title="HR Operations & Alerts" subtitle="System approvals, employee submissions, and compliance alerts" />

        <div className="dashboard-content">
          <div className="page-header-row">
            <div className="notification-title-wrap">
              <div className="section-brand-badge">
                <Bell size={18} />
              </div>
              <div>
                <h2>HR Action Center</h2>
                <p>You have <strong>{activeUnread} pending</strong> HR alert{activeUnread === 1 ? "" : "s"}</p>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleMarkAllRead}
              disabled={activeUnread === 0}
            >
              <CheckCheck size={16} />
              <span>Mark all as read</span>
            </button>
          </div>

          <div className="notification-list">
            {notifications.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className={`notification-card ${!item.read ? "unread" : ""}`}>
                  <div className={`notification-icon-box ${item.color}`}>
                    <IconComponent size={20} />
                  </div>
                  
                  <div className="notification-text-content">
                    <div className="notification-card-header">
                      <h4>{item.title}</h4>
                      <span className="notification-timestamp">{item.time}</span>
                    </div>
                    <p>{item.message}</p>
                  </div>

                  {!item.read && (
                    <button 
                      type="button" 
                      className="notification-check-btn"
                      title="Mark as read"
                      onClick={() => toggleSingleRead(item.id)}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}