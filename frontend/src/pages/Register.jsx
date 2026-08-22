import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Shield, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    password: "",
    role: "Employee"
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to email verification per DayFlow authentication flow
    navigate("/verify-email");
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
            <h2>Create an Account</h2>
            <p>Register using your official employee credentials</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required">Employee ID</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="employeeId"
                  placeholder="e.g. EMP-1042"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Official Email</label>
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
              <label className="form-label required">Role</label>
              <div className="input-wrapper">
                <Shield className="input-icon" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin / HR Officer</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a secure password"
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

            <button type="submit" className="btn btn-primary btn-full btn-lg">
              <span>Register</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}