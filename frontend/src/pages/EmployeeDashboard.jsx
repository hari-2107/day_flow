import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Clock, CalendarDays, DollarSign, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" />
      <main className="dashboard-main">
        <Navbar title="Employee Dashboard" subtitle="Here is your daily activity overview." />
        
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Attendance Today</span>
                <div className="stat-icon success"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">Checked In</div>
              <div className="stat-card-footer">Time: 09:02 AM</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Leave Balance</span>
                <div className="stat-icon"><CalendarDays size={20} /></div>
              </div>
              <div className="stat-card-value">14 Days</div>
              <div className="stat-card-footer">Paid & Sick Leave</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Pending Requests</span>
                <div className="stat-icon warning"><CheckCircle2 size={20} /></div>
              </div>
              <div className="stat-card-value">1</div>
              <div className="stat-card-footer">Sick leave under review</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Last Net Pay</span>
                <div className="stat-icon"><DollarSign size={20} /></div>
              </div>
              <div className="stat-card-value">$4,250</div>
              <div className="stat-card-footer">Paid on July 31</div>
            </div>
          </div>

          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Recent Attendance History</h3>
                <Link to="/employee/attendance" className="forgot-password">View All</Link>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Today</td>
                        <td>09:02 AM</td>
                        <td>--:--</td>
                        <td><span className="status status-present">Present</span></td>
                      </tr>
                      <tr>
                        <td>Yesterday</td>
                        <td>08:58 AM</td>
                        <td>05:04 PM</td>
                        <td><span className="status status-present">Present</span></td>
                      </tr>
                      <tr>
                        <td>Aug 20, 2026</td>
                        <td>--:--</td>
                        <td>--:--</td>
                        <td><span className="status status-absent">Leave</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Quick Clock-In</h3>
              </div>
              <div className="card-body">
                <div className="attendance-card">
                  <div className="attendance-date">Saturday, August 22, 2026</div>
                  <div className="attendance-time">09:02 AM</div>
                  <div className="attendance-actions">
                    <button className="btn btn-danger btn-full">Clock Out</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}