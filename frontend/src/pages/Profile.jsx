import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/api";
import { User, Mail, Phone, MapPin, Briefcase, IndianRupee, Save, Camera, CheckCircle2, AlertCircle, Shield } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "Adhithya Navaneethakrishnan",
    employeeId: user?.employeeId || "EMP-1042",
    email: user?.email || "alex.morgan@dayflow.io",
    role: user?.role || "EMPLOYEE",
    department: user?.department || "Software Engineering",
    designation: user?.designation || "Full Stack Developer",
    phone: user?.phone || "+91 98401 23456",
    address: user?.address || "No. 45, Anna Salai, Guindy, Chennai, Tamil Nadu 600032",
    salaryTier: user?.salary || "Grade L2 (₹85,000 / month)",
    avatar: user?.avatar || ""
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    profileService.getProfile()
      .then((res) => {
        if (res.data?.user) {
          const u = res.data.user;
          setFormData(prev => ({
            ...prev,
            name: u.name || prev.name,
            employeeId: u.employeeId || prev.employeeId,
            email: u.email || prev.email,
            role: u.role || prev.role,
            department: u.department || prev.department,
            designation: u.designation || prev.designation,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            salaryTier: u.salary || prev.salaryTier,
            avatar: u.photo || prev.avatar
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not sync latest profile:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        setFormData((prev) => ({ ...prev, avatar: imageBase64 }));
        updateUser({ avatar: imageBase64, photo: imageBase64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await profileService.updateProfile({
        phone: formData.phone,
        address: formData.address,
        photo: formData.avatar
      });

      if (res.data?.user) {
        updateUser({ ...res.data.user, avatar: formData.avatar });
      } else {
        updateUser({ phone: formData.phone, address: formData.address, avatar: formData.avatar });
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
        <Navbar title="My Profile & Credentials" subtitle="Manage your identity, residential address, and employee details" />

        <div className="dashboard-content">
          {savedSuccess && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px" }}>
              <CheckCircle2 size={16} />
              <span>Profile information and contact records synchronized successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Profile Hero Card with Photo Upload */}
          <div className="profile-hero-card" style={{ display: "flex", alignItems: "center", gap: "20px", background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div className="profile-photo-wrapper" style={{ position: "relative" }}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile Avatar" className="profile-photo-img" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div className="profile-photo-placeholder" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold" }}>
                  {(formData.name || "A").charAt(0)}
                </div>
              )}
              <label className="photo-upload-badge" title="Change Profile Picture" style={{ position: "absolute", bottom: 0, right: 0, background: "#4f46e5", color: "#fff", borderRadius: "50%", padding: "4px", cursor: "pointer", display: "flex" }}>
                <Camera size={14} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </label>
            </div>

            <div className="profile-hero-details">
              <div className="profile-hero-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>{formData.name}</h2>
                <span className="badge badge-primary" style={{ fontSize: "12px", background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: "12px" }}>
                  <Shield size={12} /> {formData.role}
                </span>
              </div>
              <p className="profile-hero-sub" style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>
                {formData.designation} • {formData.department} (ID: <strong>{formData.employeeId}</strong>)
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
                    <label className="form-label">Full Legal Name (Locked)</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" value={formData.name} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Corporate Email (Locked)</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" value={formData.email} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Primary Mobile Number (Editable)</label>
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

              {/* Employment & Compensation Overview */}
              <div className="card">
                <div className="card-header">
                  <h3>Employment & Pay Scale</h3>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Assigned Department</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.department} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Title / Designation</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.designation} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTC / Compensation Band</label>
                    <div className="input-wrapper">
                      <IndianRupee className="input-icon" size={18} />
                      <input type="text" value={formData.salaryTier} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>

                  <div style={{ marginTop: "28px" }}>
                    <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                      <Save size={16} />
                      <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
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