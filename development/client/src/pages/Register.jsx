import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "./auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    bio: "",
    portfolioUrl: "",
    specialization: "",
    businessName: "",
    panNumber: "",
    storeLocation: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (serverError) setServerError("");
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (!formData.password) {
      nextErrors.password = "Create a password.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.role) {
      nextErrors.role = "Please choose a role.";
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

      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: formData.fullName.trim(),
          Email: formData.email.trim(),
          PhoneNumber: formData.phoneNumber.trim(),
          Password: formData.password,
          role: formData.role.toLowerCase(),
          ...(formData.role.toLowerCase() === "artist"
            ? {
                bio: formData.bio.trim(),
                portfolioUrl: formData.portfolioUrl.trim(),
                specialization: formData.specialization.trim(),
              }
            : {}),
          ...(formData.role.toLowerCase() === "vendor"
            ? {
                businessName: formData.businessName.trim(),
                panNumber: formData.panNumber.trim(),
                storeLocation: formData.storeLocation.trim(),
              }
            : {}),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- UPDATED INTEGRATION LOGIC ---
        
        // 1. Prepare the app for the role before they even verify
        // This ensures the App.jsx ProtectedRoute knows what's coming
        localStorage.setItem("role", formData.role.toLowerCase());

        setSuccess(data.message || "Account created successfully.");
        
        setTimeout(() => {
          // Send to verification
          navigate(
            `/verify-email?email=${encodeURIComponent(formData.email.trim())}`
          );
        }, 1200);
      } else {
        setServerError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <Link to="/" className="auth-brand">
          <img src={logo} alt="Visual Art Gallery Store logo" />
          <span>Visual Art Gallery Store</span>
        </Link>
        <span className="auth-nav-tagline">Become part of the gallery</span>
      </header>

      <div className="auth-shell">
        <section className="auth-card" aria-label="Registration form">
          <div className="auth-card__intro">
            <span className="auth-pill">Create Account</span>
            <h1>Join the Visual Art Gallery Store</h1>
            <p>
              Build your profile to purchase limited works or manage your own
              storefront inside the gallery.
            </p>
            <div className="auth-points">
              <span>• Customer: purchase curated collections</span>
              <span>• Vendor: manage inventory and orders</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Register</h2>
            <p className="support">
              Complete these details to create your account.
            </p>

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
                <label htmlFor="fullName">Full Name</label>
                <input
                  className="input-field"
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
                <small className={`field-message ${errors.fullName ? "error" : ""}`}>
                  {errors.fullName || "Use your full legal name."}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  className="input-field"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <small className={`field-message ${errors.email ? "error" : ""}`}>
                  {errors.email || "We will confirm your email for security."}
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                className="input-field"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
              <small className={`field-message ${errors.phoneNumber ? "error" : ""}`}>
                {errors.phoneNumber || "Add a reachable number for updates."}
              </small>
            </div>

            <div className="form-grid two-col">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className="input-field"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <small className={`field-message ${errors.password ? "error" : ""}`}>
                  {errors.password || "Use at least 8 characters."}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className="input-field"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <small className={`field-message ${errors.confirmPassword ? "error" : ""}`}>
                  {errors.confirmPassword || "Repeat the password to confirm."}
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">I want to join as a:</label>
              <select
                className="input-field select-field"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Customer">Customer (Buyer)</option>
                <option value="Vendor">Vendor (Gallery Store)</option>
                <option value="Artist">Artist (Creator)</option>
              </select>
              <small className="field-message">
                Choose how you want to use the gallery.
              </small>
            </div>

            {/* ARTIST SPECIFIC FIELDS */}
            {formData.role === "Artist" && (
              <div className="form-grid fade-in">
                <div className="form-group">
                  <label htmlFor="specialization">Specialization</label>
                  <input
                    className="input-field"
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Oil Painting, Digital Art"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="portfolioUrl">Portfolio Link</label>
                  <input
                    className="input-field"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* VENDOR SPECIFIC FIELDS */}
            {formData.role === "Vendor" && (
              <div className="form-grid fade-in">
                <div className="form-group">
                  <label htmlFor="businessName">Gallery/Business Name</label>
                  <input
                    className="input-field"
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="storeLocation">Location</label>
                  <input
                    className="input-field"
                    id="storeLocation"
                    name="storeLocation"
                    type="text"
                    value={formData.storeLocation}
                    onChange={handleChange}
                    placeholder="e.g. Pokhara, Nepal"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="auth-meta">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
