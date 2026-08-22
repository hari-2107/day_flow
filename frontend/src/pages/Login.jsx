import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Employee"
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAdmin = formData.role === "Admin" || formData.email.toLowerCase().includes("admin");

    login({
      email: formData.email,
      role: isAdmin ? "Admin" : "Employee",
      name: isAdmin ? "HR Admin" : "Alex Morgan",
      employeeId: isAdmin ? "EMP-ADMIN-01" : "EMP-1042"
    });

    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">DF</div>
          <h1>Day<span>Flow</span></h1>
          <p>Every workday, perfectly aligned.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Role</label>
              <div className="input-wrapper">
                <Shield className="input-icon" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ height: "62px", paddingLeft: "54px", fontSize: "16px" }}
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin / HR Officer</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg">
              <span>Sign In</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}