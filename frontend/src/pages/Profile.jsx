import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Save } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    employeeId: user?.employeeId || "EMP-1042",
    email: user?.email || "alex.morgan@dayflow.io",
    role: user?.role || "Employee",
    department: "Engineering",
    designation: "Frontend Engineer",
    phone: user?.phone || "+1 (555) 234-5678",
    address: user?.address || "742 Evergreen Terrace, Springfield",
    salaryTier: "Grade A ($5,200 / mo)"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ phone: formData.phone, address: formData.address });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isAdmin = user?.role === "Admin";

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || "Employee"} user={user || { name: formData.name, role: formData.designation }} />
      <main className="dashboard-main">
        <Navbar title="My Profile" subtitle="View and manage your personal employee details" />

        <div className="dashboard-content">
          {savedSuccess && (
            <div className="alert alert-success">
              Profile details updated successfully!
            </div>
          )}

          <div className="profile-header">
            <div className="profile-avatar">
              {formData.name.charAt(0)}
            </div>
            <div className="profile-info">
              <h2>{formData.name}</h2>
              <p>{formData.designation} • {formData.department} ({formData.employeeId})</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="content-grid equal">
              {/* Personal Details */}
              <div className="card">
                <div className="card-header">
                  <h3>Personal Information</h3>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Full Name (Read-only)</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" value={formData.name} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Read-only)</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" value={formData.email} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Phone Number (Editable)</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={18} />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Residential Address (Editable)</label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" size={18} />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job & Payroll Overview */}
              <div className="card">
                <div className="card-header">
                  <h3>Employment & Compensation</h3>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.department} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Role / Designation</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.designation} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Salary Band (Read-only)</label>
                    <div className="input-wrapper">
                      <DollarSign className="input-icon" size={18} />
                      <input type="text" value={formData.salaryTier} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div style={{ marginTop: "32px" }}>
                    <button type="submit" className="btn btn-primary btn-full">
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}