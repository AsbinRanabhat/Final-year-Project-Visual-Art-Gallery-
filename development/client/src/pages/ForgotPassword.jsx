import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "./auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data?.emailSent === true) {
        let nextSuccess =
          data.message ||
          "If that email exists, we sent password reset instructions.";

        // Surface debug OTP when backend bypass is enabled (backend only emits this in dev).
        if (data?.debugOtp) {
          nextSuccess += ` (Dev OTP: ${data.debugOtp})`;
        }

        setSuccess(nextSuccess);
        navigate(
          `/verify-otp?email=${encodeURIComponent(email.trim())}&sent=1`,
          {
            state: { otpSentMessage: nextSuccess },
          }
        );
      } else {
        let nextError =
          data?.message || "Unable to send reset email. Please try again.";

        if (data?.debugEmailError) {
          nextError = `${nextError} (${data.debugEmailError})`;
        }

        setServerError(nextError);
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
        <section className="auth-card" aria-label="Forgot password form">
          <div className="auth-card__intro">
            <span className="auth-pill">Password Help</span>
            <h1>Reset your password</h1>
            <p>
              Enter the email linked to your account and we will send reset
              instructions.
            </p>
            <div className="auth-points">
              <span>• Secure reset link delivered by email</span>
              <span>• Quick access back to your gallery profile</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Forgot Password</h2>
            <p className="support">We will email you a reset code.</p>

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (serverError) setServerError("");
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="forgot-email-help"
                  required
                />
                <small
                  id="forgot-email-help"
                  className={`field-message ${errors.email ? "error" : ""}`}
                  aria-live="polite"
                >
                  {errors.email || "Use the email you registered with."}
                </small>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <div className="auth-meta">
              <span>Remembered your password?</span>
              <Link to="/login">Back to login</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ForgotPassword;
