import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Search, UserPlus } from "lucide-react";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees] = useState([
    { id: "EMP-1042", name: "John Doe", email: "john@dayflow.io", role: "Software Engineer", dept: "Engineering", status: "Active" },
    { id: "EMP-1043", name: "Sarah Connor", email: "sarah@dayflow.io", role: "UI/UX Designer", dept: "Design", status: "Active" },
    { id: "EMP-1044", name: "Mike Ross", email: "mike@dayflow.io", role: "Legal Counsel", dept: "Legal", status: "Active" },
    { id: "EMP-1045", name: "Rachel Zane", email: "rachel@dayflow.io", role: "HR Specialist", dept: "Human Resources", status: "Inactive" }
  ]);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={{ name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="Employee Directory" subtitle="Manage employee profiles, access, and details" />

        <div className="dashboard-content">
          <div className="page-header">
            <div className="search-wrapper">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by name or Employee ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="page-actions">
              <button className="btn btn-primary">
                <UserPlus size={16} /> Add Employee
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">{emp.name.charAt(0)}</div>
                            <div>
                              <div className="employee-name">{emp.name}</div>
                              <div className="employee-email">{emp.id} • {emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{emp.dept}</td>
                        <td>{emp.role}</td>
                        <td>
                          <span className={`status ${emp.status === "Active" ? "status-active" : "status-inactive"}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-outline" style={{ minHeight: "32px", padding: "0 12px", fontSize: "13px" }}>
                            Edit Profile
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