import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, Ambulance, Users, Activity, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

const roles = [
  { id: "patient", label: "Patient", icon: Users, color: "success" },
  { id: "ambulance", label: "Ambulance", icon: Ambulance, color: "warning" },
  { id: "hospital", label: "Hospital", icon: Building2, color: "primary" },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [activeRole, setActiveRole] = useState(searchParams.get("role") || "patient");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    vehicleNo: "",
    hospitalId: "",
    email: "",
    address: "",
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      password: "",
      vehicleNo: "",
      hospitalId: "",
      email: "",
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(activeRole, form);

    if (result.success) {
      navigate("/login");
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
            <h1>Create Account</h1>
            <p>Join the MediLink healthcare network</p>
          </div>

          <div className="auth-role-tabs">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`auth-role-tab ${activeRole === role.id ? `active tab-${role.color}` : ""}`}
                onClick={() => {
                  setActiveRole(role.id);
                  resetForm();
                }}
              >
                <role.icon size={16} />
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {activeRole === "patient" && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    placeholder="e.g., +91 99887-76655"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
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
              </>
            )}

            {activeRole === "hospital" && (
              <>
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Phone Number</label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
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
              </>
            )}

            {activeRole === "ambulance" && (
              <>
                <div className="form-group">
                  <label className="form-label">Driver Name</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ambulance Number</label>
                  <input
                    className="form-input"
                    value={form.vehicleNo}
                    onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hospital ID</label>
                  <input
                    className="form-input"
                    value={form.hospitalId}
                    onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
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
              </>
            )}

            <button type="submit" className="btn btn-primary auth-submit">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}