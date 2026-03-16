import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Activity, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.phone, form.password);

    if (result.success && result.user) {
      navigate(`/${result.user.role}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg animated-gradient">
        <div className="auth-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card card-glass">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-icon">
                <Activity size={24} />
              </div>
              <span className="logo-text">
                Medi<span className="logo-highlight">Link</span>
              </span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="tel"
                placeholder="e.g., +91 98765-43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                id="login-phone"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-password">
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" id="login-submit">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}