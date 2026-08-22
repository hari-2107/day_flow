import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { CheckSquare, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminLeaves() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([
    { id: 1, empName: "Adhithya N", empId: "EMP-1042", dept: "Engineering", type: "Casual Leave", from: "2026-08-28", to: "2026-08-29", days: 2, reason: "Attending technical conference", status: "Pending" },
    { id: 2, empName: "Sarah Connor", empId: "EMP-1043", dept: "Design", type: "Sick Leave", from: "2026-08-26", to: "2026-08-26", days: 1, reason: "Doctor appointment", status: "Pending" },
    { id: 3, empName: "Mike Ross", empId: "EMP-1044", dept: "Legal", type: "Earned Leave", from: "2026-09-01", to: "2026-09-05", days: 5, reason: "Family vacation", status: "Approved" },
  ]);

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={user || { name: "Aadhavan Raman", role: "HR Administrator" }} />
      <main className="dashboard-main">
        <Navbar title="Leave Applications & Approvals" subtitle="Review and approve employee time-off requests" />

        <div className="dashboard-content">
          <div className="card">
            <div className="card-header">
              <div className="card-header-brand">
                <CheckSquare className="section-icon" size={18} />
                <h3>Pending & Processed Requests</h3>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Dates & Duration</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <strong>{req.empName}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{req.empId} • {req.dept}</div>
                        </td>
                        <td><strong>{req.type}</strong></td>
                        <td>
                          <div>{req.from} to {req.to}</div>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>({req.days} Day{req.days > 1 ? "s" : ""})</span>
                        </td>
                        <td>{req.reason}</td>
                        <td>
                          <span className={`status ${
                            req.status === "Approved" ? "status-approved" :
                            req.status === "Rejected" ? "status-rejected" : "status-pending"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === "Pending" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button 
                                className="btn btn-success" 
                                style={{ height: "34px", padding: "0 12px", fontSize: "12px" }}
                                onClick={() => handleAction(req.id, "Approved")}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ height: "34px", padding: "0 12px", fontSize: "12px" }}
                                onClick={() => handleAction(req.id, "Rejected")}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}