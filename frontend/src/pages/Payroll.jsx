import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { IndianRupee, Download, CheckCircle2, ShieldCheck, Building2, CreditCard } from "lucide-react";

export default function Payroll() {
  const { user } = useAuth();

  const payslips = [
    { month: "July 2026", date: "31 Jul 2026", gross: "₹92,000", deductions: "₹7,200", net: "₹84,800", status: "Paid" },
    { month: "June 2026", date: "30 Jun 2026", gross: "₹92,000", deductions: "₹7,200", net: "₹84,800", status: "Paid" },
    { month: "May 2026", date: "31 May 2026", gross: "₹92,000", deductions: "₹7,200", net: "₹84,800", status: "Paid" },
    { month: "April 2026", date: "30 Apr 2026", gross: "₹88,000", deductions: "₹6,800", net: "₹81,200", status: "Paid" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || "Employee"} user={user || { name: "Adhithya N", role: "Software Engineer" }} />
      <main className="dashboard-main">
        <Navbar title="My Payroll & Compensation" subtitle="Monthly salary breakdown, tax slips, and disbursement ledger" />

        <div className="dashboard-content">
          {/* Main Hero Pay Card */}
          <div className="salary-card-inr">
            <div className="salary-card-top">
              <div>
                <span className="salary-badge"><ShieldCheck size={14} /> Verified Salary Disbursement</span>
                <p className="salary-month">August 2026 Projected Net Pay</p>
                <div className="salary-amount-inr">₹84,800.00</div>
              </div>
              <div className="salary-bank-details">
                <div className="bank-chip">
                  <Building2 size={16} />
                  <span>HDFC Bank (Chennai Main Branch)</span>
                </div>
                <div className="bank-acc">
                  <CreditCard size={14} />
                  <span>A/C: •••• •••• 4092</span>
                </div>
              </div>
            </div>
            <div className="salary-card-footer">
              <span>Next Disbursement: <strong>31 August 2026</strong></span>
              <button className="btn btn-white-glass">
                <Download size={15} />
                <span>Download Salary Statement</span>
              </button>
            </div>
          </div>

          <div className="content-grid">
            {/* Earnings Breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-brand">
                  <IndianRupee className="section-icon" size={18} />
                  <h3>Monthly Salary Component Breakdown</h3>
                </div>
              </div>
              <div className="card-body">
                <div className="breakdown-list">
                  <div className="breakdown-item">
                    <span>Basic Pay</span>
                    <strong>₹48,000.00</strong>
                  </div>
                  <div className="breakdown-item">
                    <span>House Rent Allowance (HRA)</span>
                    <strong>₹24,000.00</strong>
                  </div>
                  <div className="breakdown-item">
                    <span>Special Allowance & Conveyance</span>
                    <strong>₹15,000.00</strong>
                  </div>
                  <div className="breakdown-item">
                    <span>Medical Reimbursement</span>
                    <strong>₹5,000.00</strong>
                  </div>
                  <div className="breakdown-divider" />
                  <div className="breakdown-item text-danger">
                    <span>Provident Fund (EPF Share)</span>
                    <strong>- ₹3,800.00</strong>
                  </div>
                  <div className="breakdown-item text-danger">
                    <span>Professional Tax (Tamil Nadu)</span>
                    <strong>- ₹200.00</strong>
                  </div>
                  <div className="breakdown-item text-danger">
                    <span>TDS / Income Tax</span>
                    <strong>- ₹3,200.00</strong>
                  </div>
                  <div className="breakdown-divider" />
                  <div className="breakdown-item total">
                    <span>Net Take-Home</span>
                    <span className="net-total-inr">₹84,800.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Info Card */}
            <div className="card">
              <div className="card-header">
                <h3>Statutory & Tax Filing</h3>
              </div>
              <div className="card-body">
                <div className="statutory-list">
                  <div className="statutory-item">
                    <span className="stat-label">PAN Card</span>
                    <strong className="stat-val">ABCDE1234F</strong>
                  </div>
                  <div className="statutory-item">
                    <span className="stat-label">UAN Number</span>
                    <strong className="stat-val">100928472918</strong>
                  </div>
                  <div className="statutory-item">
                    <span className="stat-label">Tax Regime</span>
                    <strong className="stat-val">New Regime (FY 26-27)</strong>
                  </div>
                  <div className="statutory-item">
                    <span className="stat-label">Form 16</span>
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Payslips Table */}
          <div className="card">
            <div className="card-header">
              <h3>Payslip Archive</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pay Period</th>
                      <th>Disbursement Date</th>
                      <th>Gross Pay</th>
                      <th>Deductions</th>
                      <th>Net Credited</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map((slip, index) => (
                      <tr key={index}>
                        <td><strong>{slip.month}</strong></td>
                        <td>{slip.date}</td>
                        <td>{slip.gross}</td>
                        <td className="text-danger">{slip.deductions}</td>
                        <td><strong className="text-primary">{slip.net}</strong></td>
                        <td>
                          <span className="status status-approved">{slip.status}</span>
                        </td>
                        <td>
                          <button className="btn btn-outline" style={{ minHeight: "34px", padding: "0 12px", fontSize: "13px" }}>
                            <Download size={14} /> PDF Slip
                          </button>
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