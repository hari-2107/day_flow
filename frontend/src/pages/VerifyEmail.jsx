import React, { useState } from "react";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const email = sessionStorage.getItem("pending_verify_email") || "";
      const fullCode = code.join("");
      await authService.verifyEmail(fullCode, email);
      navigate("/login");
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMsg("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

            {errorMsg && (
              <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "14px" }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

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

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: "16px" }}>
              Didn't receive code? <button type="button" className="resend-link" style={{ border: "none", background: "none", color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}>Resend Code</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}