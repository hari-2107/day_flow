import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState("Employee"); // "Employee" or "Admin"
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (activeTab === "Admin") {
      login({
        email: formData.email,
        role: "Admin",
        name: "Aadhavan Raman",
        employeeId: "ADM-9001",
        avatar: ""
      });
      navigate("/admin/dashboard");
    } else {
      login({
        email: formData.email,
        role: "Employee",
        name: "Adhithya N",
        employeeId: "EMP-1042",
        avatar: ""
      });
      navigate("/employee/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">DF</div>
          <h1>Day<span>Flow</span></h1>
          <p>Enterprise Workforce & Payroll Suite</p>
        </div>

        <div className="auth-card">
          {/* Interactive Role Switcher */}
          <div className="role-switch-container">
            <button
              type="button"
              className={`role-switch-btn ${activeTab === "Employee" ? "active" : ""}`}
              onClick={() => { setActiveTab("Employee"); setErrorMessage(""); }}
            >
              <UserCheck size={18} />
              <span>Employee</span>
            </button>
            <button
              type="button"
              className={`role-switch-btn ${activeTab === "Admin" ? "active" : ""}`}
              onClick={() => { setActiveTab("Admin"); setErrorMessage(""); }}
            >
              <ShieldCheck size={18} />
              <span>HR / Admin</span>
            </button>
          </div>

          <div className="auth-card-header">
            <h2>{activeTab === "Admin" ? "HR & Admin Sign-In" : "Welcome Back"}</h2>
            <p>{activeTab === "Admin" ? "Sign in with your administrative account" : "Enter your corporate credentials to continue"}</p>
          </div>

          {errorMessage && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Official Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder={activeTab === "Admin" ? "admin@dayflow.in" : "employee@dayflow.in"}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-row" style={{ alignItems: "center" }}>
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg">
              <span>{activeTab === "Admin" ? "Sign In as Admin" : "Sign In to Workspace"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            Need an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}