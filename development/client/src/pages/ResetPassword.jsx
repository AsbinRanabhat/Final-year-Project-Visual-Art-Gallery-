import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "./auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location]);
  const initialEmail = params.get("email") || "";

  const [email] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      nextErrors.newPassword = "Use at least 8 characters.";
    }

    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      const response = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email.trim(),
          NewPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Password reset successful.");
        navigate("/login");
      } else {
        setServerError(
          data?.message || "Unable to reset password. Please try again."
        );
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
        <section className="auth-card" aria-label="Reset password form">
          <div className="auth-card__intro">
            <span className="auth-pill">Reset Password</span>
            <h1>Choose a new password</h1>
            <p>
              Set a new password for your account to regain access to your
              gallery profile.
            </p>
            <div className="auth-points">
              <span>• Use at least 8 characters</span>
              <span>• Avoid using old passwords</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleResetPassword} noValidate>
            <h2>Reset Password</h2>
            <p className="support">Create a new password to continue.</p>

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
                  aria-describedby="reset-email-help"
                  required
                />
                <small
                  id="reset-email-help"
                  className={`field-message ${errors.email ? "error" : ""}`}
                  aria-live="polite"
                >
                  {errors.email || "Resetting password for this email."}
                </small>
              </div>
            </div>

            <div className="form-grid two-col">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  className="input-field"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (serverError) setServerError("");
                    if (errors.newPassword) {
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }
                  }}
                  aria-invalid={Boolean(errors.newPassword)}
                  aria-describedby="new-password-help"
                  required
                />
                <small
                  id="new-password-help"
                  className={`field-message ${
                    errors.newPassword ? "error" : ""
                  }`}
                  aria-live="polite"
                >
                  {errors.newPassword || "Use at least 8 characters."}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className="input-field"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (serverError) setServerError("");
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }));
                    }
                  }}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby="confirm-password-help"
                  required
                />
                <small
                  id="confirm-password-help"
                  className={`field-message ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  aria-live="polite"
                >
                  {errors.confirmPassword || "Repeat your new password."}
                </small>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
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

export default ResetPassword;
