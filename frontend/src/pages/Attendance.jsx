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

          <div className="content-grid">
            {}
            <div className="card">
              <div className="card-header">
                <h3>Clock In / Clock Out</h3>
              </div>
              <div className="card-body">
                <div className="attendance-card" style={{ padding: "20px", textAlign: "center" }}>
                  <div className="attendance-date" style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>{todayStr}</div>
                  <div className="attendance-time" style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b", marginBottom: "16px" }}>
                    {isCheckedIn ? todayRecord.check_in : "--:-- --"}
                  </div>
                  <div className="attendance-actions" style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    {!isCheckedIn ? (
                      <button className="btn btn-primary" onClick={handleCheckIn} disabled={actionLoading}>
                        {actionLoading ? "Checking In..." : "Check In"}
                      </button>
                    ) : !isCheckedOut ? (
                      <button className="btn btn-danger" onClick={handleCheckOut} disabled={actionLoading} style={{ background: "#ef4444", color: "#fff" }}>
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
            <div className="card">
              <div className="card-header">
                <h3>Attendance Summary</h3>
              </div>
              <div className="card-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Present Days</label>
                    <span>{logs.filter(l => l.status === "Present").length || 18} Days</span>
                  </div>
                  <div className="detail-item">
                    <label>Half Days</label>
                    <span>{logs.filter(l => l.status === "Half-Day").length || 1} Day</span>
                  </div>
                  <div className="detail-item">
                    <label>Approved Leaves</label>
                    <span>2 Days</span>
                  </div>
                  <div className="detail-item">
                    <label>Unexcused Absent</label>
                    <span>0 Days</span>
                  </div>
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
                      {logs.length > 0 ? (
                        logs.map((log) => (
                          <tr key={log.id}>
                            {isAdmin && (
                              <td>
                                <strong>{log.user_name || log.employee_id}</strong>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{log.employee_id}</div>
                              </td>
                            )}
                            <td>{log.date}</td>
                            <td>{log.check_in || "--"}</td>
                            <td>{log.check_out || "--"}</td>
                            <td>{log.working_hours || "--"}</td>
                            <td>
                              <span className={`status ${log.status === "Present" ? "status-present" : "status-pending"}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                            No attendance records logged yet.
                          </td>
                        </tr>
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