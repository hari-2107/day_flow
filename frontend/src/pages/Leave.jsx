import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { CheckCircle, AlertCircle, Clock, CalendarDays, Check, X } from "lucide-react";
import { leaveService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Leave() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Leave Form state
  const [form, setForm] = useState({
    type: "Paid Leave",
    from: "",
    to: "",
    remarks: ""
  });

  // Admin approval modal state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminComments, setAdminComments] = useState("");
  const [actionStatus, setActionStatus] = useState("Approved");

  const fetchLeaves = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = isAdmin ? await leaveService.getAdminLeaves() : await leaveService.getMyLeaves();
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setErrorMsg("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      await leaveService.applyLeave(form);
      setBannerNotice("Leave application submitted successfully!");
      setForm({ type: "Paid Leave", from: "", to: "", remarks: "" });
      fetchLeaves();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Leave submission error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  const openApprovalModal = (leaveItem, status) => {
    setSelectedLeave(leaveItem);
    setActionStatus(status);
    setAdminComments("");
    setIsModalOpen(true);
  };

  const handleAdminStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;
    setSubmitting(true);
    try {
      await leaveService.updateStatus(selectedLeave.id, actionStatus, adminComments);
      setBannerNotice(`Leave application ${actionStatus.toLowerCase()} successfully.`);
      setIsModalOpen(false);
      fetchLeaves();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Status update error:", err);
      setErrorMsg("Failed to update leave status.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={isAdmin ? "Admin" : "Employee"} user={user || { name: "User", role: "Employee" }} />
      <main className="dashboard-main">
        <Navbar title={isAdmin ? "Leave Approvals" : "Leave Management"} subtitle="Apply for time-off and track your approvals" />

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

          <div className="leave-balance-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div className="leave-balance" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Paid Leave Balance</h4>
              <strong style={{ fontSize: "24px", color: "#4f46e5" }}>10 Days</strong>
            </div>
            <div className="leave-balance" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Sick Leave Balance</h4>
              <strong style={{ fontSize: "24px", color: "#10b981" }}>4 Days</strong>
            </div>
            <div className="leave-balance" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Unpaid Leave Used</h4>
              <strong style={{ fontSize: "24px", color: "#f59e0b" }}>0 Days</strong>
            </div>
          </div>

          <div className="content-grid">
            {/* Apply Leave Form */}
            {!isAdmin && (
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
                          style={{ height: "46px", paddingLeft: "12px", width: "100%", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        >
                          <option value="Paid Leave">Paid Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Unpaid Leave">Unpaid Leave</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        ></textarea>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Leave Requests Table */}
            <div className="card" style={{ gridColumn: isAdmin ? "1 / -1" : "auto" }}>
              <div className="card-header">
                <h3>{isAdmin ? "All Employee Leave Applications" : "My Leave Requests"}</h3>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {loading ? (
                  <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>Loading leaves...</div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {isAdmin && <th>Employee</th>}
                          <th>Type</th>
                          <th>Dates</th>
                          <th>Reason</th>
                          <th>Status</th>
                          {isAdmin && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.length > 0 ? (
                          leaves.map((l) => (
                            <tr key={l.id}>
                              {isAdmin && (
                                <td>
                                  <strong>{l.user_name || l.employee_id}</strong>
                                  <div style={{ fontSize: "12px", color: "#64748b" }}>{l.employee_id}</div>
                                </td>
                              )}
                              <td>{l.leave_type || l.type}</td>
                              <td>{l.from_date || l.from} to {l.to_date || l.to}</td>
                              <td style={{ maxWidth: "200px" }}>{l.reason || l.remarks}</td>
                              <td>
                                <span className={`status ${l.status === "Approved" ? "status-approved" : l.status === "Rejected" ? "status-inactive" : "status-pending"}`}>
                                  {l.status}
                                </span>
                              </td>
                              {isAdmin && (
                                <td>
                                  {l.status === "Pending" ? (
                                    <div style={{ display: "flex", gap: "6px" }}>
                                      <button
                                        className="btn btn-primary"
                                        style={{ padding: "4px 8px", fontSize: "12px" }}
                                        onClick={() => openApprovalModal(l, "Approved")}
                                      >
                                        <Check size={14} /> Approve
                                      </button>
                                      <button
                                        className="btn btn-outline"
                                        style={{ padding: "4px 8px", fontSize: "12px", color: "#ef4444", borderColor: "#ef4444" }}
                                        onClick={() => openApprovalModal(l, "Rejected")}
                                      >
                                        <X size={14} /> Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: "12px", color: "#64748b" }}>Completed</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isAdmin ? 6 : 4} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                              No leave applications found.
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
        </div>
      </main>

      {/* Admin Leave Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${actionStatus} Leave for ${selectedLeave?.user_name || "Employee"}`}
      >
        {selectedLeave && (
          <form onSubmit={handleAdminStatusUpdate}>
            <p style={{ marginBottom: "12px", color: "#475569" }}>
              <strong>Leave Period:</strong> {selectedLeave.from_date || selectedLeave.from} to {selectedLeave.to_date || selectedLeave.to} ({selectedLeave.leave_type})
            </p>
            <p style={{ marginBottom: "16px", color: "#475569" }}>
              <strong>Reason:</strong> {selectedLeave.reason || selectedLeave.remarks}
            </p>

            <div className="form-group">
              <label className="form-label">Admin Comments / Remarks</label>
              <div className="input-wrapper">
                <textarea
                  rows="3"
                  placeholder="Add approval or rejection remarks..."
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "16px 0 0 0", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className={`btn ${actionStatus === "Approved" ? "btn-primary" : "btn-danger"}`} disabled={submitting}>
                {submitting ? "Processing..." : `Confirm ${actionStatus}`}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}