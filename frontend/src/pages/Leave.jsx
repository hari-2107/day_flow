import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Leave() {
  const [leaves, setLeaves] = useState([
    { id: 1, type: "Sick Leave", from: "2026-08-10", to: "2026-08-11", status: "Approved", remarks: "Fever" },
    { id: 2, type: "Paid Leave", from: "2026-08-28", to: "2026-08-30", status: "Pending", remarks: "Family event" }
  ]);

  const [form, setForm] = useState({ type: "Paid Leave", from: "", to: "", remarks: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeaves([...leaves, { ...form, id: Date.now(), status: "Pending" }]);
    setForm({ type: "Paid Leave", from: "", to: "", remarks: "" });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" />
      <main className="dashboard-main">
        <Navbar title="Leave Management" subtitle="Apply for time-off and track your approvals" />

        <div className="dashboard-content">
          <div className="leave-balance-grid">
            <div className="leave-balance">
              <h4>Paid Leave Balance</h4>
              <strong>10 Days</strong>
            </div>
            <div className="leave-balance">
              <h4>Sick Leave Balance</h4>
              <strong>4 Days</strong>
            </div>
            <div className="leave-balance">
              <h4>Unpaid Leave Used</h4>
              <strong>0 Days</strong>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Apply for Leave</h3>
              </div>
              <div className="card-body">
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label required">Leave Type</label>
                    <div className="input-wrapper">
                      <select 
                        value={form.type} 
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="Paid Leave">Paid Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">From Date</label>
                      <div className="input-wrapper">
                        <input 
                          type="date" 
                          value={form.from} 
                          onChange={(e) => setForm({ ...form, from: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label required">To Date</label>
                      <div className="input-wrapper">
                        <input 
                          type="date" 
                          value={form.to} 
                          onChange={(e) => setForm({ ...form, to: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Reason / Remarks</label>
                    <div className="input-wrapper">
                      <textarea 
                        rows="3" 
                        placeholder="Provide details about your leave..."
                        value={form.remarks}
                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>My Leave Requests</h3>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l) => (
                        <tr key={l.id}>
                          <td>{l.type}</td>
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