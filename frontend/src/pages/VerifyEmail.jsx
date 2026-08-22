import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    navigate("/employee/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="verification-container">
            <div className="verification-icon">
              <Mail size={32} />
            </div>

            <div className="auth-card-header">
              <h2>Verify Your Email</h2>
              <p>We've sent a 6-digit verification code to your email.</p>
            </div>

            <form onSubmit={handleVerify}>
              <div className="verification-code">
                {code.map((num, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    maxLength="1"
                    value={num}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    required
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg">
                <span>Verify & Continue</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              Didn't receive code? <button type="button" className="resend-link">Resend Code</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}