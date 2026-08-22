import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { Download, Edit3, CheckCircle, AlertCircle, IndianRupee, ShieldCheck, Building2, CreditCard, CheckCircle2 } from "lucide-react";
import { payrollService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Payroll() {
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  const [payrollData, setPayrollData] = useState(null);
  const [payrollsList, setPayrollsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bannerNotice, setBannerNotice] = useState("");

  // Edit Payroll Modal state for Admin
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchPayroll = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (isAdmin) {
        const res = await payrollService.getAdminPayroll();
        setPayrollsList(res.data.payrolls || []);
      } else {
        const res = await payrollService.getMyPayroll();
        setPayrollData(res.data);
        setPayrollsList(res.data.payslips || []);
      }
    } catch (err) {
      console.error("Payroll fetch error:", err);
      setErrorMsg("Failed to load payroll details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [user, isAdmin]);

  const activeSlip = payrollsList[0] || {
    gross_salary: "₹92,000.00",
    net_salary: "₹84,800.00",
    basic_pay: "₹48,000.00",
    hra: "₹24,000.00",
    medical_allowance: "₹5,000.00",
    special_allowance: "₹15,000.00",
    tax_deduction: "₹3,200.00",
    health_insurance: "₹200.00",
    pf: "₹3,800.00"
  };

  const handleEditClick = (record) => {
    setSelectedRecord({ ...record });
    setIsModalOpen(true);
  };

  const handleSavePayroll = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setUpdating(true);
    try {
      await payrollService.updatePayroll(selectedRecord.user_id || selectedRecord.employee_id, {
        gross_salary: selectedRecord.gross_salary,
        basic_pay: selectedRecord.basic_pay,
        hra: selectedRecord.hra,
        medical_allowance: selectedRecord.medical_allowance,
        net_salary: selectedRecord.net_salary
      });
      setBannerNotice(`Updated payroll structure for ${selectedRecord.user_name || "Employee"}`);
      setIsModalOpen(false);
      fetchPayroll();
      setTimeout(() => setBannerNotice(""), 3500);
    } catch (err) {
      console.error("Error updating payroll:", err);
      setErrorMsg("Failed to update payroll.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={isAdmin ? "Admin" : "Employee"} user={user || { name: "User", role: "Employee" }} />
      <main className="dashboard-main">
        <Navbar title={isAdmin ? "Payroll Control" : "My Payroll & Compensation"} subtitle="Monthly salary breakdown, tax slips, and disbursement ledger" />

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

          {!isAdmin && (
            <>
              {/* Main Pay Hero Card */}
              <div className="salary-card-inr" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <div className="salary-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span className="salary-badge" style={{ background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <ShieldCheck size={14} /> Verified Salary Disbursement
                    </span>
                    <p className="salary-month" style={{ marginTop: "12px", opacity: 0.8, fontSize: "14px" }}>August 2026 Projected Net Pay</p>
                    <div className="salary-amount-inr" style={{ fontSize: "36px", fontWeight: "bold", margin: "4px 0 16px 0" }}>{payrollData?.salary || activeSlip.net_salary}</div>
                  </div>
                  <div className="salary-bank-details" style={{ textAlign: "right" }}>
                    <div className="bank-chip" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", opacity: 0.9 }}>
                      <Building2 size={16} />
                      <span>HDFC Bank Main Branch</span>
                    </div>
                    <div className="bank-acc" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", opacity: 0.7, marginTop: "4px", justifyContent: "flex-end" }}>
                      <CreditCard size={14} />
                      <span>A/C: •••• •••• 4092</span>
                    </div>
                  </div>
                </div>
                <div className="salary-card-footer" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Next Disbursement: <strong>31 August 2026</strong></span>
                  <button className="btn btn-secondary" onClick={() => alert("Downloading salary statement PDF...")} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Download size={15} />
                    <span>Download Statement</span>
                  </button>
                </div>
              </div>

              <div className="content-grid equal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div className="card">
                  <div className="card-header">
                    <h3>Salary Breakdown</h3>
                  </div>
                  <div className="card-body">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Basic Pay</label>
                        <span>{activeSlip.basic_pay}</span>
                      </div>
                      <div className="detail-item">
                        <label>House Rent Allowance</label>
                        <span>{activeSlip.hra}</span>
                      </div>
                      <div className="detail-item">
                        <label>Medical Allowance</label>
                        <span>{activeSlip.medical_allowance}</span>
                      </div>
                      <div className="detail-item">
                        <label>Special Allowance</label>
                        <span>{activeSlip.special_allowance}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Deductions & Tax</h3>
                  </div>
                  <div className="card-body">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Tax Withholding (TDS)</label>
                        <span>{activeSlip.tax_deduction}</span>
                      </div>
                      <div className="detail-item">
                        <label>Professional Tax</label>
                        <span>{activeSlip.health_insurance}</span>
                      </div>
                      <div className="detail-item">
                        <label>Provident Fund (EPF)</label>
                        <span>{activeSlip.pf}</span>
                      </div>
                      <div className="detail-item">
                        <label>Net Take-Home</label>
                        <strong style={{ color: "#4f46e5" }}>{activeSlip.net_salary}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Payslips Table */}
          <div className="card">
            <div className="card-header">
              <h3>{isAdmin ? "Employee Payroll Records" : "Payslip History"}</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>Loading payroll data...</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Month</th>
                        <th>Issued Date</th>
                        <th>Gross Pay</th>
                        <th>Net Pay</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollsList.length > 0 ? (
                        payrollsList.map((p) => (
                          <tr key={p.id}>
                            {isAdmin && (
                              <td>
                                <strong>{p.user_name || p.employee_id}</strong>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{p.employee_id}</div>
                              </td>
                            )}
                            <td>{p.month}</td>
                            <td>{p.issued_date}</td>
                            <td>{p.gross_salary}</td>
                            <td>{p.net_salary}</td>
                            <td>
                              {isAdmin ? (
                                <button className="btn btn-outline" style={{ minHeight: "32px", padding: "4px 10px", fontSize: "12px" }} onClick={() => handleEditClick(p)}>
                                  <Edit3 size={14} /> Adjust Payroll
                                </button>
                              ) : (
                                <button className="btn btn-outline" style={{ minHeight: "32px", padding: "4px 10px", fontSize: "12px" }} onClick={() => alert("Downloading payslip...")}>
                                  <Download size={14} /> Download PDF
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                            No payroll records found.
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

      {/* Admin Edit Payroll Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Adjust Payroll: ${selectedRecord?.user_name || ""}`}
      >
        {selectedRecord && (
          <form onSubmit={handleSavePayroll}>
            <div className="form-group">
              <label className="form-label">Gross Salary</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={selectedRecord.gross_salary}
                  onChange={(e) => setSelectedRecord({ ...selectedRecord, gross_salary: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Basic Pay</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={selectedRecord.basic_pay}
                    onChange={(e) => setSelectedRecord({ ...selectedRecord, basic_pay: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">HRA</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={selectedRecord.hra}
                    onChange={(e) => setSelectedRecord({ ...selectedRecord, hra: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Net Take-Home Pay</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={selectedRecord.net_salary}
                  onChange={(e) => setSelectedRecord({ ...selectedRecord, net_salary: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "16px 0 0 0", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={updating}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Saving..." : "Save Salary Details"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}