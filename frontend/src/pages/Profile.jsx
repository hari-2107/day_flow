import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/api";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    employeeId: user?.employeeId || "EMP-1042",
    email: user?.email || "alex.morgan@dayflow.io",
    role: user?.role || "EMPLOYEE",
    department: user?.department || "Engineering",
    designation: user?.designation || "Frontend Engineer",
    phone: user?.phone || "+1 (555) 234-5678",
    address: user?.address || "742 Evergreen Terrace, Springfield",
    salaryTier: user?.salary || "$5,200 / month"
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    profileService.getProfile()
      .then((res) => {
        if (res.data?.user) {
          const u = res.data.user;
          setFormData({
            name: u.name,
            employeeId: u.employeeId,
            email: u.email,
            role: u.role,
            department: u.department,
            designation: u.designation,
            phone: u.phone,
            address: u.address,
            salaryTier: u.salary
          });
        }
      })
      .catch((err) => {
        console.warn("Could not sync latest profile:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await profileService.updateProfile({
        phone: formData.phone,
        address: formData.address
      });

      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ phone: formData.phone, address: formData.address });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Profile update error:", err);
      setErrorMsg("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || "Employee"} user={user || { name: formData.name, role: formData.designation }} />
      <main className="dashboard-main">
        <Navbar title="My Profile" subtitle="View and manage your personal employee details" />

        <div className="dashboard-content">
          {savedSuccess && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px" }}>
              <CheckCircle size={16} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="profile-header" style={{ display: "flex", alignItems: "center", gap: "20px", background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div className="profile-avatar" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold" }}>
              {(formData.name || "A").charAt(0)}
            </div>
            <div className="profile-info">
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>{formData.name}</h2>
              <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>
                {formData.designation} • {formData.department} ({formData.employeeId})
              </p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="content-grid equal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
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
                    <label className="form-label">Department (Read-only)</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.department} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Role / Designation (Read-only)</label>
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

                  <div style={{ marginTop: "28px" }}>
                    <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                      <Save size={16} />
                      <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
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