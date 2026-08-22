import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { Search, Edit3, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bannerNotice, setBannerNotice] = useState("");

  // Search input state with debouncing
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal state
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await adminService.getEmployees();
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setErrorMsg("Failed to load employee directory from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    if (!debouncedSearch) return employees;
    const term = debouncedSearch.toLowerCase();
    return employees.filter(e =>
      (e.name || "").toLowerCase().includes(term) ||
      (e.id || "").toLowerCase().includes(term) ||
      (e.dept || "").toLowerCase().includes(term) ||
      (e.email || "").toLowerCase().includes(term)
    );
  }, [employees, debouncedSearch]);

  // Paginated records
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const handleEditClick = (emp) => {
    setSelectedEmp({ ...emp });
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;
    setSaving(true);
    try {
      const targetId = selectedEmp.dbId || selectedEmp.id;
      await adminService.updateEmployee(targetId, {
        name: selectedEmp.name,
        dept: selectedEmp.dept,
        role: selectedEmp.role,
        status: selectedEmp.status,
        salary: selectedEmp.salary,
        phone: selectedEmp.phone
      });

      setBannerNotice(`Updated profile details for ${selectedEmp.name}`);
      setIsEditModalOpen(false);
      fetchEmployees();
      setTimeout(() => setBannerNotice(""), 3000);
    } catch (err) {
      console.error("Error updating employee:", err);
      setErrorMsg("Failed to update employee details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={user || { name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="Employee Directory" subtitle="Manage employee profiles, access, and details" />

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

          <div className="page-header" style={{ marginBottom: "20px" }}>
            <div className="search-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "420px" }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ border: "none", outline: "none", width: "100%", fontSize: "14px" }}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  Loading employee directory...
                </div>
              ) : (
                <>
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
                        {paginatedEmployees.length > 0 ? (
                          paginatedEmployees.map((emp) => (
                            <tr key={emp.id}>
                              <td>
                                <div className="employee-cell" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div className="employee-avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                                    {(emp.name || "E").charAt(0)}
                                  </div>
                                  <div>
                                    <div className="employee-name" style={{ fontWeight: 600, color: "#1e293b" }}>{emp.name}</div>
                                    <div className="employee-email" style={{ fontSize: "12px", color: "#64748b" }}>{emp.id} • {emp.email}</div>
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
                                  style={{ minHeight: "32px", padding: "4px 12px", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}
                                  onClick={() => handleEditClick(emp)}
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                              No matching employees found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Toolbar */}
                  {filteredEmployees.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "14px", color: "#64748b" }}>
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEmployees.length)} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => p - 1)}
                        >
                          <ChevronLeft size={16} /> Prev
                        </button>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          className="btn btn-outline"
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => p + 1)}
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
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
                    style={{ height: "42px", paddingLeft: "12px" }}
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

            <div className="modal-footer" style={{ padding: "16px 0 0 0", marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}