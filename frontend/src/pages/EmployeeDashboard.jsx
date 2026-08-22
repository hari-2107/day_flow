import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { 
  Clock, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsClockedIn(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        role="Employee" 
        user={user || { name: "Adhithya N", role: "Software Engineer" }} 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <Navbar 
          title="Employee Workspace" 
          subtitle="Real-time daily attendance, tasks, and leave balance overview"
          toggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        <div className="dashboard-content">
          {/* Quick Metrics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Shift Status</span>
                <div className={`stat-icon ${isClockedIn ? "success" : "warning"}`}>
                  <Clock size={20} />
                </div>
              </div>
              <div className="stat-card-value">
                {isClockedIn ? "Active" : "Off Duty"}
              </div>
              <div className="stat-card-footer">
                {isClockedIn ? `Clocked in at ${clockInTime}` : "Standard Shift: 09:00 AM - 06:00 PM"}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Available Leaves</span>
                <div className="stat-icon success">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="stat-card-value">17 Days</div>
              <div className="stat-card-footer">8 Casual • 9 Sick remaining</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">August Net Salary</span>
                <div className="stat-icon">
                  <IndianRupee size={20} />
                </div>
              </div>
              <div className="stat-card-value">₹84,800</div>
              <div className="stat-card-footer">Scheduled for Aug 31</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Attendance Score</span>
                <div className="stat-icon success">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="stat-card-value">98.4%</div>
              <div className="stat-card-footer">Zero unexcused absences</div>
            </div>
          </div>

          <div className="content-grid">
            {/* Clock-in Module */}
            <div className="card">
              <div className="card-header">
                <h3>Daily Attendance Terminal</h3>
              </div>
              <div className="card-body">
                <div className="attendance-card">
                  <span className="form-label">Current Server Timestamp</span>
                  <div className="attendance-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                    Location: Corporate Headquarters (Chennai Wi-Fi Verified)
                  </p>
                  
                  <button 
                    type="button"
                    className={`btn ${isClockedIn ? "btn-danger" : "btn-primary"} btn-lg`}
                    onClick={handleClockToggle}
                    style={{ minWidth: "220px" }}
                  >
                    <Clock size={18} />
                    <span>{isClockedIn ? "Clock Out for Today" : "Punch Clock In"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3>Quick Navigation</h3>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/employee/leave" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} /> Apply Leave Request
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/employee/payroll" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <IndianRupee size={16} /> View August Payslip
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/employee/profile" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={16} /> Update Contact Info
                  </span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}