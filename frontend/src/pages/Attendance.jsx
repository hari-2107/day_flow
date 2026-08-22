import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { CheckCircle, AlertCircle, Clock, Calendar, CheckSquare } from "lucide-react";
import { attendanceService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const fetchAttendance = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = isAdmin ? await attendanceService.getAdminAttendance() : await attendanceService.getMyAttendance();
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setErrorMsg("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user, isAdmin]);

  
  const todayRecord = logs.find(l => {
    const isUserMatch = !isAdmin || (l.user_id === user?.id || l.employee_id === user?.employeeId);
    return isUserMatch && (l.date || "").includes(new Date().getDate().toString());
  });

  const isCheckedIn = !!(todayRecord && todayRecord.check_in && todayRecord.check_in !== "--");
  const isCheckedOut = !!(todayRecord && todayRecord.check_out && todayRecord.check_out !== "--");

  const handleCheckIn = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      await attendanceService.checkIn();
      setBannerNotice("Checked in successfully!");
      fetchAttendance();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Check-in error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to check in.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      await attendanceService.checkOut();
      setBannerNotice("Checked out successfully!");
      fetchAttendance();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Check-out error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to check out.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={isAdmin ? "Admin" : "Employee"} user={user || { name: "User", role: "Employee" }} />
      <main className="dashboard-main">
        <Navbar title={isAdmin ? "All Attendance Logs" : "My Attendance"} subtitle="Track daily work hours and check-in history" />

        <div className="dashboard-content">
          {bannerNotice && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px" }}>
              <CheckCircle size={16} />
              <span>{bannerNotice}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Horizontal Summary Strip */}
          <div className="stats-grid" style={{ marginBottom: "24px" }}>
            <div className="stat-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="stat-icon success" style={{ width: "40px", height: "40px" }}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Present Days</div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>{logs.filter(l => l.status === "Present").length || 18}</div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="stat-icon info" style={{ width: "40px", height: "40px", background: "var(--accent-cyan-soft)", color: "var(--accent-cyan)" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Half Days</div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>{logs.filter(l => l.status === "Half-Day").length || 1}</div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="stat-icon warning" style={{ width: "40px", height: "40px" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Approved Leaves</div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>2</div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="stat-icon danger" style={{ width: "40px", height: "40px" }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Unexcused Absent</div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Clock In/Out Widget */}
          <div className="card" style={{ maxWidth: "500px", margin: "0 auto 32px" }}>
            <div className="card-header" style={{ textAlign: "center", justifyContent: "center" }}>
              <h3>Daily Attendance Terminal</h3>
            </div>
            <div className="card-body">
              <div className="attendance-card" style={{ padding: "32px 20px", textAlign: "center", background: "var(--surface-subtle)", borderRadius: "10px", border: "1px solid var(--border-card)" }}>
                <div className="attendance-date" style={{ fontSize: "14px", color: "var(--text-subtle)", marginBottom: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>{todayStr}</div>
                <div className="attendance-time" style={{ fontSize: "36px", fontWeight: "900", color: "var(--text-heading)", marginBottom: "24px", fontFamily: "var(--font-mono)" }}>
                  {isCheckedIn ? todayRecord.check_in : "--:-- --"}
                </div>
                <div className="attendance-actions" style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                  {!isCheckedIn ? (
                    <button className="btn btn-primary btn-lg" onClick={handleCheckIn} disabled={actionLoading} style={{ minWidth: "200px" }}>
                      {actionLoading ? "Checking In..." : "Check In"}
                    </button>
                  ) : !isCheckedOut ? (
                    <button className="btn btn-danger btn-lg" onClick={handleCheckOut} disabled={actionLoading} style={{ background: "#ef4444", color: "#fff", minWidth: "200px" }}>
                      {actionLoading ? "Checking Out..." : "Check Out"}
                    </button>
                  ) : (
                    <div style={{ color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckSquare size={18} /> Shift Completed Today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="card" style={{ marginTop: "24px" }}>
            <div className="card-header">
              <h3>{isAdmin ? "All Employee Attendance Logs" : "Attendance Log"}</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>Loading logs...</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                              <Clock size={32} opacity={0.5} />
                              <span>No attendance recorded yet</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id}>
                            <td style={{ fontWeight: 600 }}>{log.date}</td>
                            {isAdmin && <td>{log.user_name || "Unknown"}</td>}
                            <td style={{ fontFamily: "var(--font-mono)" }}>{log.check_in || "--"}</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{log.check_out || "--"}</td>
                            <td style={{ fontFamily: "var(--font-mono)" }}>{log.hours_worked || "--"}</td>
                            <td>
                              <span className={`status-pill ${log.status === 'Present' ? 'status-approved' : (log.status === 'Absent' ? 'status-rejected' : 'status-pending')}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}