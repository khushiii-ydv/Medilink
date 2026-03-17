import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Ambulance, Users, Activity, Eye, EyeOff } from 'lucide-react';
import { initialHospitals } from '../data/mockData';
import toast from 'react-hot-toast';
import './Auth.css';

const roles = [
  { id: 'hospital', label: 'Hospital', icon: Building2, color: 'primary' },
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance, color: 'warning' },
  { id: 'patient', label: 'Patient', icon: Users, color: 'success' },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [activeRole, setActiveRole] = useState(searchParams.get('role') || 'patient');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', vehicleNo: '', hospitalId: '', type: 'BLS' });
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await register(activeRole, form);

  if (result.success) {
    toast.success('Registration successful! Welcome to MediLink.');
    navigate(`/${activeRole}`);
  } else {
    toast.error(result.message || 'Registration failed');
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
            <h1>Create Account</h1>
            <p>Join the MediLink healthcare network</p>
          </div>

          <div className="auth-role-tabs">
            {roles.map(role => (
              <button
                key={role.id}
                className={`auth-role-tab ${activeRole === role.id ? `active tab-${role.color}` : ''}`}
                onClick={() => { setActiveRole(role.id); setForm({ name: '', phone: '', password: '', vehicleNo: '', hospitalId: '', type: 'BLS' }); }}
                id={`register-tab-${role.id}`}
              >
                <role.icon size={16} />
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {activeRole === 'patient' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Enter your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="register-patient-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="e.g., +91 99887-76655" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required id="register-patient-phone" />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="register-patient-password" />
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
      <input className="form-input" placeholder="Enter driver name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="register-ambulance-name" />
    </div>

    <div className="form-group">
      <label className="form-label">Phone Number</label>
      <input className="form-input" placeholder="e.g., +91 98765-43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required id="register-ambulance-phone" />
    </div>

    <div className="form-group">
      <label className="form-label">Password</label>
      <div className="input-password">
        <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="register-ambulance-password" />
        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Vehicle Number</label>
      <input className="form-input" placeholder="e.g., DL-01-AB-1234" value={form.vehicleNo} onChange={e => setForm({...form, vehicleNo: e.target.value})} required id="register-ambulance-vehicle" />
    </div>

    <div className="form-group">
      <label className="form-label">Associated Hospital</label>
      <select className="form-select" value={form.hospitalId} onChange={e => setForm({...form, hospitalId: e.target.value})} required id="register-ambulance-hospital">
        <option value="">Select hospital</option>
        {initialHospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Ambulance Type</label>
      <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})} id="register-ambulance-type">
        <option value="BLS">BLS (Basic Life Support)</option>
        <option value="ALS">ALS (Advanced Life Support)</option>
      </select>
    </div>
  </>
)}

            {activeRole === 'hospital' && (
              <>
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <select className="form-select" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="register-hospital-name">
                    <option value="">Select your hospital</option>
                    {initialHospitals.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                  </select>
                  <span className="form-hint">Hospitals are pre-registered. Select and enter password to login.</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-password">
                    <input className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required id="register-hospital-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary auth-submit" id="register-submit">
              {activeRole === 'hospital' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" id="register-login-link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
