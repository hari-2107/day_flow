import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, PlusCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function Leave() {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([
    { id: 1, type: "Casual Leave", from: "2026-08-25", to: "2026-08-26", days: 2, status: "Approved", reason: "Family Event" },
    { id: 2, type: "Sick Leave", from: "2026-08-10", to: "2026-08-10", days: 1, status: "Approved", reason: "Viral Fever" },
    { id: 3, type: "Earned Leave", from: "2026-09-15", to: "2026-09-18", days: 4, status: "Pending", reason: "Annual Vacation" },
  ]);

  const [formData, setFormData] = useState({
    type: "Casual Leave",
    from: "",
    to: "",
    reason: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      type: formData.type,
      from: formData.from,
      to: formData.to,
      days: 2,
      status: "Pending",
      reason: formData.reason
    };
    setLeaves([newReq, ...leaves]);
    setSubmitted(true);
    setFormData({ type: "Casual Leave", from: "", to: "", reason: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || "Employee"} user={user || { name: "Adhithya N", role: "Software Engineer" }} />
      <main className="dashboard-main">
        <Navbar title="Leave & Absence Management" subtitle="Apply for leaves, view balance quotas, and approval statuses" />

        <div className="dashboard-content">
          {submitted && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>Leave application submitted to HR Manager for review!</span>
            </div>
          )}

          {/* Leave Balance Counters */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Casual Leaves</span>
                <div className="stat-icon"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">08 / 12</div>
              <div className="stat-card-footer">4 Days Utilized</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Sick Leaves</span>
                <div className="stat-icon warning"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">09 / 10</div>
              <div className="stat-card-footer">1 Day Utilized</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Earned / Privilege</span>
                <div className="stat-icon success"><CheckCircle size={20} /></div>
              </div>
              <div className="stat-card-value">15 / 15</div>
              <div className="stat-card-footer">Fully Available</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Unpaid Leave (LWP)</span>
                <div className="stat-icon danger"><AlertCircle size={20} /></div>
              </div>
              <div className="stat-card-value">00 Days</div>
              <div className="stat-card-footer">Zero loss of pay days</div>
            </div>
          </div>

          <div className="content-grid">
            {/* Apply Leave Form */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-brand">
                  <PlusCircle className="section-icon" size={18} />
                  <h3>Submit New Leave Request</h3>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label className="form-label required">Leave Type</label>
                    <div className="input-wrapper">
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="Casual Leave">Casual Leave (CL)</option>
                        <option value="Sick Leave">Sick Leave (SL)</option>
                        <option value="Earned Leave">Earned Leave (EL)</option>
                        <option value="Compensatory Off">Compensatory Off</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Start Date</label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          value={formData.from}
                          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label required">End Date</label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          value={formData.to}
                          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Reason / Remarks</label>
                    <div className="input-wrapper">
                      <textarea
                        placeholder="State your reason for absence..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    <span>Submit Request</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Leave History Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-brand">
                  <CalendarDays className="section-icon" size={18} />
                  <h3>My Leave History</h3>
                </div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l) => (
                        <tr key={l.id}>
                          <td>
                            <strong>{l.type}</strong>
                            <div style={{ fontSize: "11px", color: "#64748b" }}>{l.reason}</div>
                          </td>
                          <td>{l.from} to {l.to}</td>
                          <td>
                            <span className={`status ${l.status === "Approved" ? "status-approved" : "status-pending"}`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}