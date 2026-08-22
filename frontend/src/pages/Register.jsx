import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register:", form);

    navigate("/verify-email");
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">

          <div className="brand-icon">
            D
          </div>

          <h1>
            Day<span>Flow</span>
          </h1>

          <p>
            Create your employee account.
          </p>

        </div>

        <div className="auth-card">

          <div className="auth-header">

            <h2>Create account</h2>

            <p>
              Join your organization on DayFlow
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Full Name</label>

              <div className="input-wrapper">

                <User size={19} />

                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            <div className="input-group">

              <label>Confirm Password</label>

              <div className="input-wrapper">

                <Lock size={19} />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <button className="primary-button">

              Create Account

              <ArrowRight size={18} />

            </button>

          </form>

          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;