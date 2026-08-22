import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Users, Clock, CalendarDays, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={{ name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="Admin Dashboard" subtitle="Overview of organization attendance, leaves, and staff." />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Total Employees</span>
                <div className="stat-icon"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">148</div>
              <div className="stat-card-footer">Across 6 departments</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Present Today</span>
                <div className="stat-icon success"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">132</div>
              <div className="stat-card-footer">89.2% attendance rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Pending Leaves</span>
                <div className="stat-icon warning"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">7</div>
              <div className="stat-card-footer">Requires review</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Monthly Payroll</span>
                <div className="stat-icon"><DollarSign size={20} /></div>
              </div>
              <div className="stat-card-value">$248.5K</div>
              <div className="stat-card-footer">Cycle ending soon</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Attendance Activity</h3>
                <Link to="/employee/attendance" className="forgot-password">View All</Link>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Time In</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">JD</div>
                            <div>
                              <div className="employee-name">John Doe</div>
                              <div className="employee-email">EMP-1042</div>
                            </div>
                          </div>
                        </td>
                        <td>Engineering</td>
                        <td>08:55 AM</td>
                        <td><span className="status status-present">Present</span></td>
                      </tr>
                      <tr>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">SC</div>
                            <div>
                              <div className="employee-name">Sarah Connor</div>
                              <div className="employee-email">EMP-1043</div>
                            </div>
                          </div>
                        </td>
                        <td>Design</td>
                        <td>09:12 AM</td>
                        <td><span className="status status-present">Present</span></td>
                      </tr>
                      <tr>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">MK</div>
                            <div>
                              <div className="employee-name">Mike Ross</div>
                              <div className="employee-email">EMP-1044</div>
                            </div>
                          </div>
                        </td>
                        <td>Legal</td>
                        <td>--</td>
                        <td><span className="status status-pending">On Leave</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Quick Management</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link to="/employees" className="btn btn-outline btn-full">Manage Employees</Link>
                  <Link to="/employee/leave" className="btn btn-outline btn-full">Review Leave Requests</Link>
                  <Link to="/payroll" className="btn btn-outline btn-full">Salary Structure Control</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}