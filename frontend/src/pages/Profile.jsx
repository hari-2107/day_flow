import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Briefcase, IndianRupee, Save, Camera, CheckCircle2, Shield } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "Adhithya Navaneethakrishnan",
    employeeId: user?.employeeId || "EMP-1042",
    email: user?.email || "adhithya@dayflow.in",
    role: user?.role || "Employee",
    department: "Software Engineering",
    designation: "Full Stack Developer",
    phone: user?.phone || "+91 98401 23456",
    address: user?.address || "No. 45, Anna Salai, Guindy, Chennai, Tamil Nadu 600032",
    salaryTier: "Grade L2 (₹85,000 / month)",
    avatar: user?.avatar || ""
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

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
        updateUser({ avatar: imageBase64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ 
      phone: formData.phone, 
      address: formData.address,
      avatar: formData.avatar 
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || "Employee"} user={user || { name: formData.name, role: formData.designation }} />
      <main className="dashboard-main">
        <Navbar title="My Profile & Credentials" subtitle="Manage your identity, residential address, and employee details" />

        <div className="dashboard-content">
          {savedSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>Profile information and contact records synchronized successfully!</span>
            </div>
          )}

          {/* Profile Hero Card with Photo Upload */}
          <div className="profile-hero-card">
            <div className="profile-photo-wrapper">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile Avatar" className="profile-photo-img" />
              ) : (
                <div className="profile-photo-placeholder">
                  {formData.name.charAt(0)}
                </div>
              )}
              <label className="photo-upload-badge" title="Change Profile Picture">
                <Camera size={16} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              </label>
            </div>

            <div className="profile-hero-details">
              <div className="profile-hero-title">
                <h2>{formData.name}</h2>
                <span className="badge badge-primary"><Shield size={12} /> {formData.role}</span>
              </div>
              <p className="profile-hero-sub">{formData.designation} • {formData.department} (ID: <strong>{formData.employeeId}</strong>)</p>
              <div className="profile-hero-meta">
                <span><Mail size={14} /> {formData.email}</span>
                <span><Phone size={14} /> {formData.phone}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="content-grid equal">
              {/* Personal Details */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-brand">
                    <User className="section-icon" size={18} />
                    <h3>Personal Information</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Full Legal Name (Locked)</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" value={formData.name} disabled className="input-readonly" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Corporate Email (Locked)</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" value={formData.email} disabled className="input-readonly" />
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
                      <textarea
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
                  <div className="card-header-brand">
                    <Briefcase className="section-icon" size={18} />
                    <h3>Employment & Pay Scale</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Assigned Department</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.department} disabled className="input-readonly" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Title / Designation</label>
                    <div className="input-wrapper">
                      <Briefcase className="input-icon" size={18} />
                      <input type="text" value={formData.designation} disabled className="input-readonly" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTC / Compensation Band</label>
                    <div className="input-wrapper">
                      <IndianRupee className="input-icon" size={18} />
                      <input type="text" value={formData.salaryTier} disabled className="input-readonly" />
                    </div>
                  </div>

                  <div style={{ marginTop: "30px" }}>
                    <button type="submit" className="btn btn-primary btn-full">
                      <Save size={16} />
                      <span>Save Profile Changes</span>
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