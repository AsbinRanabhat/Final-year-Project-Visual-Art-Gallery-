import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError("");
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    }
    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError("");
    setLoading(true);

    try {
      // Determine API URL (using Vite env or fallback to localhost:3000)
      const API_BASE =
        (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

      const apiUrl = `${API_BASE}/login`;

      const response = await fetch(apiUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.email.trim(),
          Password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- INTEGRATION LOGIC ---
        
        // 1. Save Token and User Data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // 2. Save Role specifically for ProtectedRoute in App.jsx
        localStorage.setItem("role", data.user.role);

        // 3. Conditional Redirect based on role
        const userRole = data.user.role;

        if (userRole === "vendor" || userRole === "admin") {
          navigate("/vendor"); // Send to Vendor Dashboard
        } else if (userRole === "artist") {
          navigate("/profile"); // Or Artist Dashboard if you have one
        } else {
          navigate("/"); // Standard customers go to Home Gallery
        }
        
      } else {
        setServerError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setServerError(`Cannot reach the server: ${err?.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <Link to="/login" className="auth-brand">
          <img src={logo} alt="Visual Art Gallery Store logo" />
          <span>Visual Art Gallery Store</span>
        </Link>
        <span className="auth-nav-tagline">Curated art & secure checkout</span>
      </header>

      <div className="auth-shell">
        <section className="auth-card">
          <div className="auth-card__intro">
            <span className="auth-pill">Member Access</span>
            <h1>Welcome back to the Visual Art Gallery Store</h1>
            <p>Sign in to continue exploring curated collections and manage your orders securely.</p>
            <div className="auth-points">
              <span>• Review saved collections and wishlists</span>
              <span>• Track orders and secure checkout</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Login</h2>
            <p className="support">Enter your details to continue.</p>

            {serverError && (
              <div className="alert error" role="alert">
                {serverError}
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
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <small className={`field-message ${errors.email ? "error" : ""}`}>
                  {errors.email || "Use the email you registered with."}
                </small>
              </div>

              <div className="form-group">
                <div className="field-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" size="small" className="field-link">Forgot?</Link>
                </div>
                <input
                  className="input-field"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <small className={`field-message ${errors.password ? "error" : ""}`}>
                  {errors.password || "Enter your account password."}
                </small>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="auth-meta">
              <span>New to the gallery?</span>
              <Link to="/register">Create an account</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;