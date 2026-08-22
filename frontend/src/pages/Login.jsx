import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";

export default function Login() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Employee");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successNotice, setSuccessNotice] = useState(location.state?.notice || "");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
    if (successNotice) setSuccessNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authService.signin({
        email: formData.email,
        password: formData.password
      });

      const { user, token } = res.data;
      login(user, token);

      const userRole = (user.role || "").toUpperCase();
      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMessage = err.response?.data?.message || "Invalid credentials or server connection failed.";
      setErrorMsg(serverMessage);
    } finally {
      setLoading(false);
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
          <div className="role-switch-container">
            <button
              type="button"
              className={`role-switch-btn ${activeTab === "Employee" ? "active" : ""}`}
              onClick={() => { setActiveTab("Employee"); setErrorMsg(""); }}
            >
              <UserCheck size={18} />
              <span>Employee</span>
            </button>
            <button
              type="button"
              className={`role-switch-btn ${activeTab === "Admin" ? "active" : ""}`}
              onClick={() => { setActiveTab("Admin"); setErrorMsg(""); }}
            >
              <ShieldCheck size={18} />
              <span>HR / Admin</span>
            </button>
          </div>

          <div className="auth-card-header">
            <h2>{activeTab === "Admin" ? "HR & Admin Sign-In" : "Welcome Back"}</h2>
            <p>{activeTab === "Admin" ? "Sign in with your administrative account" : "Enter your corporate credentials to continue"}</p>
          </div>

          {successNotice && (
            <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#d1fae5", color: "#065f46", borderRadius: "8px", fontSize: "14px" }}>
              <CheckCircle size={18} />
              <span>{successNotice}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "14px" }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Official Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder={activeTab === "Admin" ? "admin@dayflow.io" : "alex.morgan@dayflow.io"}
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

            <div className="form-row" style={{ marginTop: "-8px", marginBottom: "16px" }}>
              <label className="checkbox-row">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>{activeTab === "Admin" ? "Sign In as Admin" : "Sign In to Workspace"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: "20px" }}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}