import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Ambulance, Users, Shield, Activity, Eye, EyeOff, Stethoscope, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const roles = [
  { id: 'hospital', label: 'Hospital', icon: Building2, color: 'primary', desc: 'Manage your facility' },
  { id: 'admin', label: 'Admin', icon: Shield, color: 'danger', desc: 'Platform oversight' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'accent', desc: 'Resolve priority cases' },
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance, color: 'warning', desc: 'Emergency response' },
  { id: 'patient', label: 'Patient', icon: Users, color: 'success', desc: 'Find medical help' },
];

export default function Login() {
  const [activeRole, setActiveRole] = useState('hospital');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare credentials based on role
      const credentials = {};
      if (activeRole === 'hospital' || activeRole === 'ambulance') {
        credentials.name = form.name;
        credentials.password = form.password;
      } else if (activeRole === 'admin' || activeRole === 'doctor') {
        credentials.email = form.email;
        credentials.password = form.password;
      } else {
        credentials.phone = form.phone;
        credentials.password = form.password;
      }

      const result = await login(activeRole, credentials);
      if (result.success) {
        toast.success(`Welcome back, ${result.name || 'Member'}!`);
      } else {
        toast.error(result.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
            <p>Select your role to sign in</p>
          </div>

          <div className="role-selector-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            {roles.map(role => (
              <button
                key={role.id}
                type="button"
                className={`role-select-box ${activeRole === role.id ? 'active' : ''}`}
                onClick={() => setActiveRole(role.id)}
              >
                <div className={`role-icon-circle ${role.color}`}>
                  <role.icon size={20} />
                </div>
                <div className="role-select-info">
                  <span className="role-label">{role.label}</span>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form mt-4">
            <div className="form-grid">
              {(activeRole === 'hospital' || activeRole === 'ambulance') && (
                <div className="form-group grid-full">
                  <label className="form-label">
                    <User size={14} /> {activeRole === 'hospital' ? 'Hospital Name' : 'Driver Name'}
                  </label>
                  <input 
                    className="form-input" 
                    placeholder={activeRole === 'hospital' ? "e.g., Apollo Multispeciality" : "Enter your name"} 
                    value={form.name} 
                    onChange={e => updateForm('name', e.target.value)} 
                    required 
                  />
                </div>
              )}

              {(activeRole === 'admin' || activeRole === 'doctor') && (
                <div className="form-group grid-full">
                  <label className="form-label"><Mail size={14} /> Email Address</label>
                  <input 
                    className="form-input" 
                    type="email"
                    placeholder="name@medilink.com" 
                    value={form.email} 
                    onChange={e => updateForm('email', e.target.value)} 
                    required 
                  />
                </div>
              )}

              {activeRole === 'patient' && (
                <div className="form-group grid-full">
                  <label className="form-label"><Phone size={14} /> Phone Number</label>
                  <input 
                    className="form-input" 
                    placeholder="+91 99887 76655" 
                    value={form.phone} 
                    onChange={e => updateForm('phone', e.target.value)} 
                    required 
                  />
                </div>
              )}

              <div className="form-group grid-full">
                <label className="form-label"><Lock size={14} /> Password</label>
                <div className="input-password">
                  <input 
                    className="form-input" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter your password" 
                    value={form.password} 
                    onChange={e => updateForm('password', e.target.value)} 
                    required 
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit btn-lg" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>

          <div className="auth-demo-info mt-4">
            <p className="demo-title">Demo Credentials</p>
            {activeRole === 'hospital' && <p>Name: <strong>Apollo Multispeciality Hospital</strong> / Pass: <strong>apollo123</strong></p>}
            {activeRole === 'admin' && <p>Email: <strong>admin@medilink.com</strong> / Pass: <strong>admin123</strong></p>}
            {activeRole === 'doctor' && <p>Email: <strong>doctor1@medilink.com</strong> / Pass: <strong>doc123</strong></p>}
            {activeRole === 'ambulance' && <p>Name: <strong>Raju Prasad</strong> / Pass: <strong>raju123</strong></p>}
            {activeRole === 'patient' && <p>Phone: <strong>+91 99887-76655</strong> / Pass: <strong>amit123</strong></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
