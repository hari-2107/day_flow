import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Clock, Users, UserCheck, AlertTriangle, Search, Filter } from "lucide-react";

export default function AdminAttendance() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  const [logs, setLogs] = useState([
    { id: "EMP-1042", name: "Adhithya N", dept: "Engineering", checkIn: "09:02 AM", checkOut: "--:--", status: "Present", overtime: "0.0 hrs" },
    { id: "EMP-1043", name: "Sarah Connor", dept: "Design", checkIn: "09:14 AM", checkOut: "06:15 PM", status: "Present", overtime: "0.5 hrs" },
    { id: "EMP-1044", name: "Mike Ross", dept: "Legal", checkIn: "--:--", checkOut: "--:--", status: "Absent", overtime: "0.0 hrs" },
    { id: "EMP-1045", name: "Rachel Zane", dept: "HR", checkIn: "08:50 AM", checkOut: "--:--", status: "Present", overtime: "0.0 hrs" },
    { id: "EMP-1046", name: "Vikram Seth", dept: "Engineering", checkIn: "09:45 AM", checkOut: "--:--", status: "Late", overtime: "0.0 hrs" },
  ]);

  const filteredLogs = logs.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "All" || item.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={user || { name: "Aadhavan Raman", role: "HR Administrator" }} />
      <main className="dashboard-main">
        <Navbar title="Company Attendance Monitor" subtitle="Real-time daily employee attendance and timekeeping records" />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Total On Duty</span>
                <div className="stat-icon success"><UserCheck size={20} /></div>
              </div>
              <div className="stat-card-value">42 / 48</div>
              <div className="stat-card-footer">87.5% present today</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Absent / On Leave</span>
                <div className="stat-icon danger"><AlertTriangle size={20} /></div>
              </div>
              <div className="stat-card-value">04</div>
              <div className="stat-card-footer">2 Sick • 2 Casual</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Late Arrivals</span>
                <div className="stat-icon warning"><Clock size={20} /></div>
              </div>
              <div className="stat-card-value">02</div>
              <div className="stat-card-footer">After 09:30 AM buffer</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Logged Overtime</span>
                <div className="stat-icon"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">18.5 hrs</div>
              <div className="stat-card-footer">This pay period</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
              <div className="search-wrapper" style={{ maxWidth: "300px", margin: 0 }}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search employee..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <select 
                  className="input-wrapper" 
                  style={{ height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid var(--border-card)" }}
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Legal">Legal</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Overtime</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <strong>{log.name}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{log.id}</div>
                        </td>
                        <td>{log.dept}</td>
                        <td><strong>{log.checkIn}</strong></td>
                        <td>{log.checkOut}</td>
                        <td>{log.overtime}</td>
                        <td>
                          <span className={`status ${
                            log.status === "Present" ? "status-present" :
                            log.status === "Late" ? "status-pending" : "status-absent"
                          }`}>
                            {log.status}
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
      </main>
    </div>
  );
}   