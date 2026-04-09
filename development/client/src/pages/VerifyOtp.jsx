import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "./auth.css";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location]);
  const initialEmail = params.get("email") || "";
  const otpSentViaLink = params.get("sent") === "1";
  const otpSentMessage = location.state?.otpSentMessage;
  const showOtpSentNotice = Boolean(otpSentMessage) || otpSentViaLink;

  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!otp.trim()) {
      nextErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(otp.trim())) {
      nextErrors.otp = "Enter the 6-digit OTP.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email.trim(), Otp: otp.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "OTP verified. You can reset your password.");
        navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      } else {
        setServerError(data?.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <Link to="/login" className="auth-brand" aria-label="Login page">
          <img src={logo} alt="Visual Art Gallery Store logo" />
          <span>Visual Art Gallery Store</span>
        </Link>
        <span className="auth-nav-tagline">Recover your account securely</span>
      </header>

      <div className="auth-shell">
        <section className="auth-card" aria-label="Verify OTP form">
          <div className="auth-card__intro">
            <span className="auth-pill">Verify OTP</span>
            <h1>Enter the code we sent</h1>
            <p>
              Use the 6-digit code sent to your email to verify and continue
              the reset.
            </p>
            <div className="auth-points">
              <span>• OTP expires in 10 minutes</span>
              <span>• Check spam if you do not see it</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
            <h2>Verify OTP</h2>
            <p className="support">Enter the 6-digit code from your email.</p>

            {showOtpSentNotice && (
              <div className="alert success" role="status" aria-live="polite">
                {otpSentMessage ||
                  (email
                    ? `OTP sent to ${email}. Please check your inbox.`
                    : "OTP sent. Please check your email inbox.")}
              </div>
            )}

            {serverError && (
              <div className="alert error" role="alert">
                {serverError}
              </div>
            )}

            {success && (
              <div className="alert success" role="status" aria-live="polite">
                {success}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  className="input-field"
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  readOnly
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="verify-email-help"
                  required
                />
                <small
                  id="verify-email-help"
                  className={`field-message ${errors.email ? "error" : ""}`}
                  aria-live="polite"
                >
                  {errors.email || "We are verifying this email address."}
                </small>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  className="input-field"
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (serverError) setServerError("");
                    if (errors.otp) {
                      setErrors((prev) => ({ ...prev, otp: "" }));
                    }
                  }}
                  aria-invalid={Boolean(errors.otp)}
                  aria-describedby="otp-help"
                  required
                />
                <small
                  id="otp-help"
                  className={`field-message ${errors.otp ? "error" : ""}`}
                  aria-live="polite"
                >
                  {errors.otp || "Check your email for the 6-digit code."}
                </small>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="auth-meta">
              <span>Need a new code?</span>
              <Link to="/forgot-password">Resend OTP</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default VerifyOtp;
