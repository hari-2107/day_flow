import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { CheckCircle, AlertCircle, Clock, CalendarDays, Check, X } from "lucide-react";
import { leaveService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Leave() {
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  
  const [form, setForm] = useState({
    type: "Casual Leave",
    from: "",
    to: "",
    remarks: ""
  });

  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
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
      setForm({ type: "Casual Leave", from: "", to: "", remarks: "" });
      fetchLeaves();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Leave submission error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setSubmitting(false);
      setIsSlideOverOpen(false);
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
        <Navbar title={isAdmin ? "Leave Approvals" : "Leave & Absence Management"} subtitle="Apply for leaves, view balance quotas, and track approvals" />

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

          {}
          <div className="stats-grid" style={{ marginBottom: "24px" }}>
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Casual Leaves</span>
                <div className="stat-icon info"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">08 / 12</div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--surface-subtle)", borderRadius: "2px", margin: "12px 0 8px" }}>
                <div style={{ width: "66%", height: "100%", backgroundColor: "var(--accent-cyan)", borderRadius: "2px" }}></div>
              </div>
              <div className="stat-card-footer">4 Days Utilized</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Sick Leaves</span>
                <div className="stat-icon warning"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">09 / 10</div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--surface-subtle)", borderRadius: "2px", margin: "12px 0 8px" }}>
                <div style={{ width: "90%", height: "100%", backgroundColor: "var(--accent-amber)", borderRadius: "2px" }}></div>
              </div>
              <div className="stat-card-footer">1 Day Utilized</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Earned / Privilege</span>
                <div className="stat-icon success"><CheckCircle size={20} /></div>
              </div>
              <div className="stat-card-value">15 / 15</div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--surface-subtle)", borderRadius: "2px", margin: "12px 0 8px" }}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "var(--accent-emerald)", borderRadius: "2px" }}></div>
              </div>
              <div className="stat-card-footer">Fully Available</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Unpaid Leave (LWP)</span>
                <div className="stat-icon danger"><AlertCircle size={20} /></div>
              </div>
              <div className="stat-card-value">00 Days</div>
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--surface-subtle)", borderRadius: "2px", margin: "12px 0 8px" }}>
                <div style={{ width: "0%", height: "100%", backgroundColor: "var(--accent-rose)", borderRadius: "2px" }}></div>
              </div>
              <div className="stat-card-footer">Zero loss of pay days</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-heading)", margin: 0 }}>
              {isAdmin ? "All Employee Leave Applications" : "My Leave Requests"}
            </h3>
            {!isAdmin && (
              <button className="btn btn-primary" onClick={() => setIsSlideOverOpen(true)}>
                <CalendarDays size={16} /> Apply for Leave
              </button>
            )}
          </div>

          <div className="card">
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
                        {leaves.length === 0 ? (
                          <tr>
                            <td colSpan={isAdmin ? "6" : "5"} style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                                <CalendarDays size={32} opacity={0.5} />
                                <span>No leave applications found</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          leaves.map((l) => (
                            <tr key={l.id}>
                              {isAdmin && (
                                <td>
                                  <strong>{l.user_name || l.employee_id}</strong>
                                  <div style={{ fontSize: "12px", color: "#64748b" }}>{l.employee_id}</div>
                                </td>
                              )}
                              <td style={{ fontWeight: 600 }}>{l.leave_type || l.type}</td>
                              <td style={{ fontFamily: "var(--font-mono)" }}>
                                {l.from_date || l.from} <span style={{ color: "var(--text-subtle)", fontSize: "11px" }}>to</span> {l.to_date || l.to}
                              </td>
                              <td style={{ maxWidth: "200px" }}>{l.reason || l.remarks}</td>
                              <td>
                                <span className={`status-pill ${l.status === "Approved" ? "status-approved" : l.status === "Rejected" ? "status-rejected" : "status-pending"}`}>
                                  {l.status}
                                </span>
                              </td>
                              {isAdmin && (
                                <td>
                                  {l.status === "Pending" ? (
                                    <div style={{ display: "flex", gap: "6px" }}>
                                      <button
                                        className="btn btn-primary"
                                        style={{ padding: "4px 8px", fontSize: "12px", height: "28px" }}
                                        onClick={() => openApprovalModal(l, "Approved")}
                                      >
                                        <Check size={14} /> Approve
                                      </button>
                                      <button
                                        className="btn btn-outline"
                                        style={{ padding: "4px 8px", fontSize: "12px", height: "28px", color: "#ef4444", borderColor: "#ef4444" }}
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
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
      </main>

      {}
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

      {/* Slide-over for Leave Application */}
      <div className={`slide-over-overlay ${isSlideOverOpen ? "open" : ""}`} onClick={(e) => e.target.classList.contains('slide-over-overlay') && setIsSlideOverOpen(false)}>
        <div className="slide-over-panel">
          <div className="slide-over-header">
            <h3>Submit New Leave Request</h3>
            <button className="btn btn-icon" onClick={() => setIsSlideOverOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={24} />
            </button>
          </div>
          <div className="slide-over-body">
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label required">Leave Type</label>
                <div className="input-wrapper">
                  <CalendarDays className="input-icon" size={18} />
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Sick Leave">Sick Leave (SL)</option>
                    <option value="Earned Leave">Earned Leave (EL)</option>
                    <option value="Unpaid Leave">Unpaid Leave (LWP)</option>
                  </select>
                </div>
              </div>

              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label required">From Date</label>
                  <div className="input-wrapper">
                    <CalendarDays className="input-icon" size={18} />
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
                    <CalendarDays className="input-icon" size={18} />
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
                    rows="4"
                    placeholder="Provide details about your leave..."
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    required
                    style={{ padding: "14px", paddingLeft: "44px" }}
                  ></textarea>
                </div>
              </div>

              <div style={{ marginTop: "32px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsSlideOverOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}