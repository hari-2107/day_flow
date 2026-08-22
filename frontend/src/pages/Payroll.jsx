import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Download } from "lucide-react";

export default function Payroll() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" />
      <main className="dashboard-main">
        <Navbar title="My Payroll" subtitle="View your salary details and payment slips" />

        <div className="dashboard-content">
          <div className="salary-card">
            <div className="salary-card-label">Monthly Gross Salary</div>
            <div className="salary-card-amount">$5,200.00</div>
            <div className="salary-card-footer">Net Take-Home: $4,250.00 / month</div>
          </div>

          <div className="content-grid equal">
            <div className="card">
              <div className="card-header">
                <h3>Salary Breakdown</h3>
              </div>
              <div className="card-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Basic Pay</label>
                    <span>$3,200.00</span>
                  </div>
                  <div className="detail-item">
                    <label>House Rent Allowance</label>
                    <span>$1,200.00</span>
                  </div>
                  <div className="detail-item">
                    <label>Medical Allowance</label>
                    <span>$400.00</span>
                  </div>
                  <div className="detail-item">
                    <label>Special Allowance</label>
                    <span>$400.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Deductions</h3>
              </div>
              <div className="card-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Tax Withholding</label>
                    <span>$650.00</span>
                  </div>
                  <div className="detail-item">
                    <label>Health Insurance</label>
                    <span>$200.00</span>
                  </div>
                  <div className="detail-item">
                    <label>Provident Fund</label>
                    <span>$100.00</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Deductions</label>
                    <span>$950.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Payslip History</h3>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Issued Date</th>
                      <th>Gross Pay</th>
                      <th>Net Pay</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>July 2026</td>
                      <td>July 31, 2026</td>
                      <td>$5,200.00</td>
                      <td>$4,250.00</td>
                      <td>
                        <button className="btn btn-outline" style={{ minHeight: "32px", padding: "0 10px" }}>
                          <Download size={14} /> Download
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>June 2026</td>
                      <td>June 30, 2026</td>
                      <td>$5,200.00</td>
                      <td>$4,250.00</td>
                      <td>
                        <button className="btn btn-outline" style={{ minHeight: "32px", padding: "0 10px" }}>
                          <Download size={14} /> Download
                        </button>
                      </td>
                    </tr>
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