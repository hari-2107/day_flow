import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Clock, CalendarDays, DollarSign, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { attendanceService, leaveService, payrollService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
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
          if (attRes.status === "fulfilled") setAttendance(attRes.value.data.logs || []);
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

  const todayRecord = attendance[0];
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  const isCheckedIn = !!(todayRecord && todayRecord.check_in && todayRecord.check_in !== "--");

  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" user={user || { name: "User", role: "Employee" }} />
      <main className="dashboard-main">
        <Navbar title="Employee Dashboard" subtitle="Here is your daily activity overview." />
        
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Attendance Today</span>
                <div className="stat-icon success"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">{isCheckedIn ? "Checked In" : "Not Checked In"}</div>
              <div className="stat-card-footer">{isCheckedIn ? `Time: ${todayRecord.check_in}` : "Clock in via Attendance page"}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Leave Balance</span>
                <div className="stat-icon"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">14 Days</div>
              <div className="stat-card-footer">Paid & Sick Leave</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Pending Requests</span>
                <div className="stat-icon warning"><CheckCircle2 size={20} /></div>
              </div>
              <div className="stat-card-value">{pendingLeaves}</div>
              <div className="stat-card-footer">Leave applications under review</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Monthly Gross Pay</span>
                <div className="stat-icon"><DollarSign size={20} /></div>
              </div>
              <div className="stat-card-value">{payroll?.salary || "$5,200"}</div>
              <div className="stat-card-footer">Regular monthly band</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Attendance History</h3>
                <Link to="/employee/attendance" className="forgot-password">View All</Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length > 0 ? (
                        attendance.slice(0, 4).map((att) => (
                          <tr key={att.id}>
                            <td>{att.date}</td>
                            <td>{att.check_in || "--"}</td>
                            <td>{att.check_out || "--"}</td>
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
                            No attendance history recorded.
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
                <h3>Quick Actions</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link to="/employee/attendance" className="btn btn-primary btn-full" style={{ justifyContent: "center" }}>
                    Go to Clock In / Attendance
                  </Link>
                  <Link to="/employee/leave" className="btn btn-outline btn-full" style={{ justifyContent: "center" }}>
                    Apply for Leave
                  </Link>
                  <Link to="/employee/payroll" className="btn btn-outline btn-full" style={{ justifyContent: "center" }}>
                    View Salary Payslips
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}