import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Users, Clock, CalendarDays, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [empRes, leaveRes, attRes] = await Promise.allSettled([
          adminService.getEmployees(),
          adminService.getLeaves(),
          adminService.getAttendance()
        ]);

        if (isMounted) {
          if (empRes.status === "fulfilled") setEmployees(empRes.value.data.employees || []);
          if (leaveRes.status === "fulfilled") setLeaves(leaveRes.value.data.leaves || []);
          if (attRes.status === "fulfilled") setAttendance(attRes.value.data.logs || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdminData();
    return () => { isMounted = false; };
  }, []);

  const pendingLeavesCount = leaves.filter(l => l.status === "Pending").length;
  const presentCount = attendance.filter(a => a.status === "Present").length;

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={user || { name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="Admin Dashboard" subtitle="Overview of organization attendance, leaves, and staff." />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Total Employees</span>
                <div className="stat-icon"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">{loading ? "..." : employees.length || 3}</div>
              <div className="stat-card-footer">Active directory records</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Present Today</span>
                <div className="stat-icon success"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">{loading ? "..." : presentCount || 1}</div>
              <div className="stat-card-footer">Checked in today</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Pending Leaves</span>
                <div className="stat-icon warning"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">{loading ? "..." : pendingLeavesCount}</div>
              <div className="stat-card-footer">Requires review</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Monthly Payroll</span>
                <div className="stat-icon"><DollarSign size={20} /></div>
              </div>
              <div className="stat-card-value">$18.5K</div>
              <div className="stat-card-footer">Cycle active</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Attendance Activity</h3>
                <Link to="/admin/attendance" className="forgot-password">View All</Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Time In</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length > 0 ? (
                        attendance.slice(0, 5).map((att) => (
                          <tr key={att.id}>
                            <td>
                              <div className="employee-cell" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className="employee-avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>
                                  {(att.user_name || "E").charAt(0)}
                                </div>
                                <div>
                                  <div className="employee-name" style={{ fontWeight: 600 }}>{att.user_name}</div>
                                  <div className="employee-email" style={{ fontSize: "12px", color: "#64748b" }}>{att.employee_id}</div>
                                </div>
                              </div>
                            </td>
                            <td>{att.date}</td>
                            <td>{att.check_in || "--"}</td>
                            <td>
                              <span className={`status ${att.status === "Present" ? "status-present" : "status-pending"}`}>
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                            No recent attendance activity.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Quick HR Management</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link to="/admin/employees" className="btn btn-outline btn-full" style={{ justifyContent: "center" }}>Manage Employees</Link>
                  <Link to="/admin/leaves" className="btn btn-outline btn-full" style={{ justifyContent: "center" }}>Review Leave Requests</Link>
                  <Link to="/admin/payroll" className="btn btn-outline btn-full" style={{ justifyContent: "center" }}>Salary Structure Control</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}