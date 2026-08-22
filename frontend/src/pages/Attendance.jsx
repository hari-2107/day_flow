import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Attendance() {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar role="Employee" />
      <main className="dashboard-main">
        <Navbar title="My Attendance" subtitle="Track your daily work hours and status" />

        <div className="dashboard-content">
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h3>Clock In / Clock Out</h3>
              </div>
              <div className="card-body">
                <div className="attendance-card">
                  <div className="attendance-date">Saturday, August 22, 2026</div>
                  <div className="attendance-time">{checkedIn ? "09:15 AM" : "--:-- --"}</div>
                  <div className="attendance-actions">
                    {!checkedIn ? (
                      <button className="btn btn-primary" onClick={() => setCheckedIn(true)}>
                        Check In
                      </button>
                    ) : (
                      <button className="btn btn-danger" onClick={() => setCheckedIn(false)}>
                        Check Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Monthly Attendance Summary</h3>
              </div>
              <div className="card-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Present Days</label>
                    <span>18 Days</span>
                  </div>
                  <div className="detail-item">
                    <label>Half Days</label>
                    <span>1 Day</span>
                  </div>
                  <div className="detail-item">
                    <label>Approved Leaves</label>
                    <span>2 Days</span>
                  </div>
                  <div className="detail-item">
                    <label>Unexcused Absent</label>
                    <span>0 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Attendance Log</h3>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Aug 22, 2026</td>
                      <td>09:15 AM</td>
                      <td>--</td>
                      <td>--</td>
                      <td><span className="status status-present">Present</span></td>
                    </tr>
                    <tr>
                      <td>Aug 21, 2026</td>
                      <td>09:00 AM</td>
                      <td>05:00 PM</td>
                      <td>8h 00m</td>
                      <td><span className="status status-present">Present</span></td>
                    </tr>
                    <tr>
                      <td>Aug 20, 2026</td>
                      <td>09:10 AM</td>
                      <td>01:10 PM</td>
                      <td>4h 00m</td>
                      <td><span className="status status-pending">Half-Day</span></td>
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