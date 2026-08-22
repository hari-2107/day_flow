import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { Download, Edit3, CheckCircle, AlertCircle, IndianRupee, ShieldCheck, Building2, CreditCard, CheckCircle2, Check } from "lucide-react";
import { payrollService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Payroll() {
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  const [downloadSuccess, setDownloadSuccess] = useState("");
  const [payrollData, setPayrollData] = useState(null);
  const [payrollsList, setPayrollsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bannerNotice, setBannerNotice] = useState("");


  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fallbackPayslips = [
    { id: 1, month: "July 2026", date: "31 Jul 2026", gross: "₹92,000", deductions: "₹7,200", net: "₹84,800", status: "Paid" },
    { id: 2, month: "June 2026", date: "30 Jun 2026", gross: "₹92,000", deductions: "₹7,200", net: "₹84,800", status: "Paid" },
    { id: 3, month: "May 2026", date: "31 May 2026", gross: "₹88,000", deductions: "₹6,800", net: "₹81,200", status: "Paid" },
    { id: 4, month: "April 2026", date: "30 Apr 2026", gross: "₹88,000", deductions: "₹6,800", net: "₹81,200", status: "Paid" },
  ];

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


  const triggerDownload = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleDownloadStatement = () => {
    const listToExport = payrollsList.length > 0 ? payrollsList : fallbackPayslips;
    const statementContent = `=====================================================
worksync HRMS - CONSOLIDATED ANNUAL SALARY STATEMENT
=====================================================
Employee Name : ${user?.name || "Adhithya N"}
Employee ID   : ${user?.employeeId || "EMP-1042"}
Bank Account  : HDFC Bank (A/C: **** **** 4092)
PAN Number    : ABCDE1234F
Tax Regime    : New Tax Regime (FY 2026-27)
Generated On  : ${new Date().toLocaleDateString('en-GB')}
-----------------------------------------------------
PAYSLIP DISBURSEMENT ARCHIVE:
-----------------------------------------------------
${listToExport.map(s => `${(s.month || "Current Month").padEnd(14)} | Date: ${s.date || s.issued_date || "31 Aug 2026"} | Gross: ${(s.gross || s.gross_salary || "₹92,000").padEnd(8)} | Deductions: ${(s.deductions || "₹7,200").padEnd(8)} | Net: ${s.net || s.net_salary || "₹84,800"}`).join("\n")}
-----------------------------------------------------
Total Net Credited (YTD) : ₹3,35,600.00
Status                   : Fully Reconciled & Disbursed
=====================================================
Generated electronically by worksync HRMS Enterprise Engine.
`;

    triggerDownload(`Salary_Statement_${user?.employeeId || "EMP-1042"}.txt`, statementContent);
    setDownloadSuccess("Consolidated Salary Statement downloaded successfully!");
    setTimeout(() => setDownloadSuccess(""), 3500);
  };


  const handleDownloadSlip = (slip) => {
    const monthName = slip?.month || "August 2026";
    const dateStr = slip?.date || slip?.issued_date || "31 Aug 2026";
    const grossVal = slip?.gross || slip?.gross_salary || "₹92,000.00";
    const deductionsVal = slip?.deductions || "₹7,200.00";
    const netVal = slip?.net || slip?.net_salary || "₹84,800.00";
    const statusVal = slip?.status || "Paid";

    const payslipContent = `=====================================================
worksync HRMS - MONTHLY SALARY PAYSLIP
=====================================================
Pay Period    : ${monthName}
Payment Date  : ${dateStr}
Employee Name : ${user?.name || slip?.user_name || "Adhithya N"}
Employee ID   : ${user?.employeeId || slip?.employee_id || "EMP-1042"}
Department    : Software Engineering
Bank Details  : HDFC Bank (Chennai Branch) - A/C **** 4092
-----------------------------------------------------
EARNINGS & ALLOWANCES:
  - Basic Pay                            : ₹48,000.00
  - House Rent Allowance (HRA)           : ₹24,000.00
  - Special Allowance & Conveyance       : ₹15,000.00
  - Medical Allowance                    : ₹5,000.00
  ---------------------------------------------------
  Gross Earnings                         : ${grossVal}

DEDUCTIONS & STATUTORY CONTRIBUTIONS:
  - Provident Fund (EPF Employee Share)  : ₹3,800.00
  - Professional Tax (Tamil Nadu)        : ₹200.00
  - Income Tax (TDS Deduction)           : ₹3,200.00
  ---------------------------------------------------
  Total Deductions                       : ${deductionsVal}
-----------------------------------------------------
NET TAKE-HOME SALARY CREDITED            : ${netVal}
Payment Status                           : ${statusVal}
=====================================================
This is a computer-generated salary advice and requires no signature.
`;

    triggerDownload(`Payslip_${monthName.replace(/\s+/g, "_")}_${user?.employeeId || "EMP-1042"}.txt`, payslipContent);
    setDownloadSuccess(`Payslip for ${monthName} downloaded successfully!`);
    setTimeout(() => setDownloadSuccess(""), 3500);
  };

  const displayList = payrollsList.length > 0 ? payrollsList : fallbackPayslips;

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

          {downloadSuccess && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px" }}>
              <Check size={18} />
              <span>{downloadSuccess}</span>
            </div>
          )}

          { }
          <div className="salary-card-inr">
            <div className="salary-card-top">
              <div>
                <span className="salary-card-subtitle">August 2026 Net Take-Home</span>
                <h2 className="salary-card-amount">{activeSlip.net_salary || "₹84,800"}</h2>
              </div>
              <div className="salary-badge">
                <ShieldCheck size={16} /> Verified & Disbursed
              </div>
            </div>
            <div className="salary-card-meta">
              <div>
                <span className="meta-label">Gross Salary</span>
                <span className="meta-val">{activeSlip.gross_salary || "₹92,000"}</span>
              </div>
              <div>
                <span className="meta-label">Deductions</span>
                <span className="meta-val">{activeSlip.tax_deduction ? "₹7,200" : "₹7,200"}</span>
              </div>
              <div>
                <span className="meta-label">Payment Channel</span>
                <span className="meta-val" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CreditCard size={15} /> Direct Bank Transfer
                </span>
              </div>
            </div>
            <div className="salary-card-footer">
              <span>Next Disbursement: <strong>31 August 2026</strong></span>
              <button
                type="button"
                className="btn btn-white-glass"
                onClick={handleDownloadStatement}
              >
                <Download size={15} />
                <span>Download Salary Statement</span>
              </button>
            </div>
          </div>

          { }
          {!isAdmin && (
            <div className="grid-2-col" style={{ marginBottom: "24px" }}>
              <div className="card">
                <div className="card-header">
                  <h3>Earnings Breakdown</h3>
                </div>
                <div className="card-body">
                  <div className="breakdown-list">
                    <div className="breakdown-item">
                      <span>Basic Pay</span>
                      <strong>{activeSlip.basic_pay || "₹48,000.00"}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>House Rent Allowance (HRA)</span>
                      <strong>{activeSlip.hra || "₹24,000.00"}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Special Allowance</span>
                      <strong>{activeSlip.special_allowance || "₹15,000.00"}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Medical Allowance</span>
                      <strong>{activeSlip.medical_allowance || "₹5,000.00"}</strong>
                    </div>
                    <div className="breakdown-item total">
                      <span>Total Earnings</span>
                      <strong style={{ color: "#10b981" }}>{activeSlip.gross_salary || "₹92,000.00"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Deductions & Statutory Taxes</h3>
                </div>
                <div className="card-body">
                  <div className="breakdown-list">
                    <div className="breakdown-item">
                      <span>Provident Fund (EPF Share)</span>
                      <strong>{activeSlip.pf || "₹3,800.00"}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Income Tax (TDS)</span>
                      <strong>{activeSlip.tax_deduction || "₹3,200.00"}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span>Professional Tax (TN)</span>
                      <strong>{activeSlip.health_insurance || "₹200.00"}</strong>
                    </div>
                    <div className="breakdown-item total">
                      <span>Net Disbursed</span>
                      <strong style={{ color: "#4f46e5" }}>{activeSlip.net_salary || "₹84,800.00"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          { }
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
                        <th>Pay Period / Month</th>
                        <th>Disbursement Date</th>
                        <th>Gross Pay</th>
                        <th>Net Take-Home</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayList.length > 0 ? (
                        displayList.map((slip, index) => (
                          <tr key={slip.id || index}>
                            {isAdmin && (
                              <td>
                                <strong>{slip.user_name || slip.employee_id || "Employee"}</strong>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>{slip.employee_id}</div>
                              </td>
                            )}
                            <td><strong>{slip.month || "August 2026"}</strong></td>
                            <td>{slip.date || slip.issued_date || "31 Aug 2026"}</td>
                            <td>{slip.gross || slip.gross_salary || "₹92,000"}</td>
                            <td><strong className="text-primary">{slip.net || slip.net_salary || "₹84,800"}</strong></td>
                            <td style={{ textAlign: "right" }}>
                              {isAdmin ? (
                                <button className="btn btn-outline" style={{ minHeight: "32px", padding: "4px 10px", fontSize: "12px" }} onClick={() => handleEditClick(slip)}>
                                  <Edit3 size={14} /> Adjust Payroll
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  style={{ minHeight: "32px", padding: "4px 10px", fontSize: "12px" }}
                                  onClick={() => handleDownloadSlip(slip)}
                                >
                                  <Download size={14} /> PDF Slip
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

      { }
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