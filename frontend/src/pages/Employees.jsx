import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { Search, UserPlus, Edit3, CheckCircle } from "lucide-react";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([
    { id: "EMP-1042", name: "John Doe", email: "john@dayflow.io", role: "Software Engineer", dept: "Engineering", status: "Active", phone: "+1 (555) 123-4567", salary: "$5,200" },
    { id: "EMP-1043", name: "Sarah Connor", email: "sarah@dayflow.io", role: "UI/UX Designer", dept: "Design", status: "Active", phone: "+1 (555) 987-6543", salary: "$4,800" },
    { id: "EMP-1044", name: "Mike Ross", email: "mike@dayflow.io", role: "Legal Counsel", dept: "Legal", status: "Active", phone: "+1 (555) 345-6789", salary: "$6,100" },
    { id: "EMP-1045", name: "Rachel Zane", email: "rachel@dayflow.io", role: "HR Specialist", dept: "Human Resources", status: "Inactive", phone: "+1 (555) 456-7890", salary: "$4,500" }
  ]);

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (emp) => {
    setSelectedEmp({ ...emp });
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    setEmployees(employees.map(emp => emp.id === selectedEmp.id ? selectedEmp : emp));
    setIsEditModalOpen(false);
    setBannerNotice(`Updated profile details for ${selectedEmp.name}`);
    setTimeout(() => setBannerNotice(""), 3000);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={{ name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="Employee Directory" subtitle="Manage employee profiles, access, and details" />

        <div className="dashboard-content">
          {bannerNotice && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              <span>{bannerNotice}</span>
            </div>
          )}

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
                      <th>Monthly Salary</th>
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
                        <td>{emp.salary}</td>
                        <td>
                          <span className={`status ${emp.status === "Active" ? "status-active" : "status-inactive"}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline" 
                            style={{ minHeight: "32px", padding: "0 12px", fontSize: "13px" }}
                            onClick={() => handleEditClick(emp)}
                          >
                            <Edit3 size={14} /> Edit
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

      {/* Admin Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Details: ${selectedEmp?.name || ""}`}
      >
        {selectedEmp && (
          <form onSubmit={handleSaveEmployee}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={selectedEmp.name}
                  onChange={(e) => setSelectedEmp({ ...selectedEmp, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={selectedEmp.dept}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, dept: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={selectedEmp.role}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, role: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <div className="input-wrapper">
                  <select
                    value={selectedEmp.status}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Salary Band</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={selectedEmp.salary}
                    onChange={(e) => setSelectedEmp({ ...selectedEmp, salary: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: "16px 0 0 0", marginTop: "16px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}