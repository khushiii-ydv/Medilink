import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Ambulance, Users, Shield, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, color: 'danger' },
  { id: 'hospital', label: 'Hospital', icon: Building2, color: 'primary' },
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance, color: 'warning' },
  { id: 'patient', label: 'Patient', icon: Users, color: 'success' },
];

export default function Login() {
  const [activeRole, setActiveRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(activeRole, form);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(`/${activeRole}`);
    } else {
      toast.error(result.message);
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
              <div className="logo-icon"><Activity size={24} /></div>
              <span className="logo-text">Medi<span className="logo-highlight">Link</span></span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your dashboard</p>
          </div>

          <div className="auth-role-tabs">
            {roles.map(role => (
              <button
                key={role.id}
                className={`auth-role-tab ${activeRole === role.id ? `active tab-${role.color}` : ''}`}
                onClick={() => { setActiveRole(role.id); setForm({ name: '', phone: '', email: '', password: '' }); }}
                id={`login-tab-${role.id}`}
              >
                <role.icon size={16} />
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {activeRole === 'admin' && (
              <>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="e.g., admin@medilink.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required id="login-admin-email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="login-admin-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeRole === 'hospital' && (
              <>
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <input className="form-input" placeholder="e.g., Apollo Multispeciality Hospital" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="login-hospital-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="login-hospital-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeRole === 'ambulance' && (
              <>
                <div className="form-group">
                  <label className="form-label">Driver Name</label>
                  <input className="form-input" placeholder="e.g., Raju Prasad" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="login-ambulance-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="e.g., +91 98765-43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required id="login-ambulance-phone" />
                </div>
              </>
            )}

            {activeRole === 'patient' && (
              <>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="e.g., +91 99887-76655" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required id="login-patient-phone" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="login-patient-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary auth-submit" id="login-submit">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" id="login-register-link">Create one</Link></p>
          </div>

          <div className="auth-demo-info">
            <p className="demo-title">Demo Credentials</p>
            {activeRole === 'admin' && <p>Email: <strong>admin@medilink.com</strong> / Password: <strong>admin123</strong></p>}
            {activeRole === 'hospital' && <p>Name: <strong>Apollo Multispeciality Hospital</strong> / Password: <strong>apollo123</strong></p>}
            {activeRole === 'ambulance' && <p>Name: <strong>Raju Prasad</strong> / Phone: <strong>+91 98765-43210</strong></p>}
            {activeRole === 'patient' && <p>Phone: <strong>+91 99887-76655</strong> / Password: <strong>amit123</strong></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
