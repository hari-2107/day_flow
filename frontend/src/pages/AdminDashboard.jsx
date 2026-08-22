import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { 
  Users, 
  Clock, 
  CalendarDays, 
  IndianRupee, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, name: "Adhithya N", type: "Casual Leave", days: "2 Days (Aug 28 - Aug 29)", reason: "Technical conference" },
    { id: 2, name: "Sarah Connor", type: "Sick Leave", days: "1 Day (Aug 26)", reason: "Doctor appointment" },
  ]);

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

  const handleDecision = (id) => {
    setPendingApprovals(pendingApprovals.filter(item => item.id !== id));
  };

  const pendingLeavesCount = leaves.length > 0 ? leaves.filter(l => l.status === "Pending").length : pendingApprovals.length;
  const presentCount = attendance.length > 0 ? attendance.filter(a => a.status === "Present").length : 42;
  const totalHeadcount = employees.length > 0 ? employees.length : 48;

  return (
    <div className="dashboard-layout">
      <Sidebar 
        role="Admin" 
        user={user || { name: "Aadhavan Raman", role: "HR Administrator" }} 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="dashboard-main">
        <Navbar 
          title="HR Administration Console" 
          subtitle="Organization overview, daily presence, and pending leave approvals"
          toggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        <div className="dashboard-content">
          {}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Active Headcount</span>
                <div className="stat-icon">
                  <Users size={20} />
                </div>
              </div>
              <div className="stat-card-value">{loading ? "..." : `${totalHeadcount} Staff`}</div>
              <div className="stat-card-footer">Active directory records</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Present Today</span>
                <div className="stat-icon success">
                  <Clock size={20} />
                </div>
              </div>
              <div className="stat-card-value">{loading ? "..." : `${presentCount} / ${totalHeadcount}`}</div>
              <div className="stat-card-footer">Attendance records logged</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Pending Leaves</span>
                <div className="stat-icon warning">
                  <CalendarDays size={20} />
                </div>
              </div>
              <div className="stat-card-value">{loading ? "..." : `${pendingLeavesCount} Requests`}</div>
              <div className="stat-card-footer">Awaiting HR authorization</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Monthly Payroll</span>
                <div className="stat-icon">
                  <IndianRupee size={20} />
                </div>
              </div>
              <div className="stat-card-value">₹41.2 L</div>
              <div className="stat-card-footer">Reconciliation completed</div>
            </div>
          </div>

          <div className="content-grid">
            {}
            <div className="card">
              <div className="card-header">
                <h3>Pending Leave Authorizations</h3>
                <Link to="/admin/leaves" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 700 }}>
                  View All
                </Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {pendingApprovals.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                    <CheckCircle size={32} style={{ color: "var(--accent-emerald)", margin: "0 auto 8px" }} />
                    <p>All leave applications have been reviewed!</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Leave Type</th>
                          <th>Duration</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map(req => (
                          <tr key={req.id}>
                            <td>
                              <strong>{req.name}</strong>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{req.reason}</div>
                            </td>
                            <td>{req.type}</td>
                            <td>{req.days}</td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button 
                                  className="btn btn-success" 
                                  style={{ height: "32px", padding: "0 10px", fontSize: "12px" }}
                                  onClick={() => handleDecision(req.id)}
                                >
                                  Approve
                                </button>
                                <button 
                                  className="btn btn-danger" 
                                  style={{ height: "32px", padding: "0 10px", fontSize: "12px" }}
                                  onClick={() => handleDecision(req.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="card">
              <div className="card-header">
                <h3>Admin Management Hub</h3>
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/admin/employees" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Users size={16} /> Employee Directory
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/admin/attendance" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} /> Attendance Logs
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/admin/analytics" className="btn btn-secondary btn-full" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertTriangle size={16} /> Analytics & Compliance
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