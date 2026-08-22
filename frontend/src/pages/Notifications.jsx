import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { CheckCircle2, AlertTriangle, Info, Bell } from "lucide-react";

export default function Notifications() {
  const alerts = [
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your sick leave request for Aug 10 - Aug 11 has been approved by HR.",
      time: "2 hours ago",
      type: "success",
      unread: true
    },
    {
      id: 2,
      title: "July Payslip Generated",
      message: "Your payroll breakdown and salary slip for July 2026 are now available for download.",
      time: "1 day ago",
      type: "info",
      unread: false
    },
    {
      id: 3,
      title: "Attendance Notice",
      message: "Please remember to clock out before 07:00 PM to record your full working hours.",
      time: "3 days ago",
      type: "warning",
      unread: false
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" />
      <main className="dashboard-main">
        <Navbar title="Notifications" subtitle="Recent announcements, approvals, and reminders" />

        <div className="dashboard-content">
          <div className="card">
            <div className="card-header">
              <h3>All Notifications</h3>
              <button className="forgot-password">Mark all as read</button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="notification-list">
                {alerts.map((item) => (
                  <div key={item.id} className={`notification-item ${item.unread ? "unread" : ""}`}>
                    <div className="notification-icon">
                      {item.type === "success" && <CheckCircle2 size={18} className="text-success" />}
                      {item.type === "warning" && <AlertTriangle size={18} className="text-warning" />}
                      {item.type === "info" && <Info size={18} className="text-primary" />}
                    </div>
                    <div className="notification-content">
                      <h4>{item.title}</h4>
                      <p>{item.message}</p>
                      <div className="notification-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}