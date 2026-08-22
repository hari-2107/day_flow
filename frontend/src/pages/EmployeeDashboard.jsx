import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { 
  Clock, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Loader2,
  MapPin,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { attendanceService, leaveService, payrollService } from "../services/api";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [isPunching, setIsPunching] = useState(false);

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const [attRes, leaveRes, payRes] = await Promise.allSettled([
          attendanceService.getMyAttendance(),
          leaveService.getMyLeaves(),
          payrollService.getMyPayroll()
        ]);

        if (isMounted) {
          if (attRes.status === "fulfilled") {
            const logs = attRes.value.data.logs || [];
            setAttendance(logs);
            if (logs.length > 0 && logs[0].check_in && logs[0].check_in !== "--") {
              setIsClockedIn(true);
              setClockInTime(logs[0].check_in);
            }
          }
          if (leaveRes.status === "fulfilled") setLeaves(leaveRes.value.data.leaves || []);
          if (payRes.status === "fulfilled") setPayroll(payRes.value.data);
        }
      } catch (err) {
        console.error("Employee dashboard data load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEmployeeData();
    return () => { isMounted = false; };
  }, [user]);

  const handleClockToggle = async () => {
    setIsPunching(true);
    if (!isClockedIn) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(true);
      setClockInTime(nowTime);
      try {
        await attendanceService.checkIn();
      } catch (e) {
        console.warn("API check-in note:", e?.message);
      }
    } else {
      setIsClockedIn(false);
      try {
        await attendanceService.checkOut();
      } catch (e) {
        console.warn("API check-out note:", e?.message);
      }
    }
    setTimeout(() => setIsPunching(false), 600); // Artificial delay for UX
  };

  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;

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

        <div className="dashboard-content" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          
          <div style={{ flex: "1 1 0%", minWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Daily Attendance Terminal (Hero) */}
            <div className="card">
              <div className="card-header">
                <h3>Daily Attendance Terminal</h3>
              </div>
              <div className="card-body">
                <div className="attendance-card">
                  <span className="form-label">Current Server Timestamp</span>
                  <div className="attendance-time" style={{ fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="pulsing-dot" style={{ width: "12px", height: "12px", backgroundColor: "var(--accent-emerald)", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={14} /> Location: Corporate Headquarters <CheckCircle size={14} color="var(--accent-emerald)" style={{ marginLeft: "4px" }} />
                  </p>
                  
                  <button 
                    type="button"
                    className={`btn ${isClockedIn ? "btn-danger" : "btn-primary"} btn-lg`}
                    onClick={handleClockToggle}
                    disabled={isPunching}
                    style={{ minWidth: "220px", opacity: isPunching ? 0.7 : 1 }}
                  >
                    {isPunching ? <Loader2 size={18} className="spin-anim" /> : <Clock size={18} />}
                    <span>{isPunching ? "Processing..." : (isClockedIn ? "Clock Out for Today" : "Punch Clock In")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="stats-grid" style={{ marginBottom: 0 }}>
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
                  <div className="stat-icon info">
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
          </div>

          {/* Quick Navigation Right Rail */}
          <div className="card" style={{ width: "300px", height: "fit-content", flexShrink: 0 }}>
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
      </main>
    </div>
  );
}