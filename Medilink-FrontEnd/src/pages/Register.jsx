import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Ambulance, Users, Activity, Eye, EyeOff, Mail, Phone, Lock, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const roles = [
  { id: 'patient', label: 'Patient', icon: Users, color: 'success', desc: 'Book hospital visits & ambulances' },
  { id: 'hospital', label: 'Hospital', icon: Building2, color: 'primary', desc: 'Register your medical facility' },
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance, color: 'warning', desc: 'Join the emergency network' },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [activeRole, setActiveRole] = useState(searchParams.get('role') || 'patient');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '',
    phone: '', 
    password: '', 
    address: '',
    vehicleNo: '', 
    hospitalId: '', 
    type: 'BLS' 
  });
  
  const { register, isAuthenticated, user } = useAuth();
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
      const result = await register(activeRole, form);
      if (result.success) {
        toast.success('Registration successful! Welcome to MediLink.');
        // Navigation is handled by useEffect
      } else {
        toast.error(result.message || 'Registration failed');
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
            <h1>Create Account</h1>
            <p>Join the healthcare revolution</p>
          </div>

          <div className="role-selector-grid">
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
                  <span className="role-desc">{role.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form mt-4">
            <div className="form-grid">
              <div className="form-group grid-full">
                <label className="form-label">
                  <User size={14} /> {activeRole === 'hospital' ? 'Hospital Name' : 'Full Name'}
                </label>
                <input 
                  className="form-input" 
                  placeholder={activeRole === 'hospital' ? "e.g., City General Hospital" : "Enter your full name"} 
                  value={form.name} 
                  onChange={e => updateForm('name', e.target.value)} 
                  required 
                />
              </div>

              {activeRole === 'hospital' && (
                <>
                  <div className="form-group">
                    <label className="form-label"><Mail size={14} /> Email Address</label>
                    <input 
                      className="form-input" 
                      type="email"
                      placeholder="hospital@example.com" 
                      value={form.email} 
                      onChange={e => updateForm('email', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Phone size={14} /> Phone Number</label>
                    <input 
                      className="form-input" 
                      placeholder="+91 88888 88888" 
                      value={form.phone} 
                      onChange={e => updateForm('phone', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group grid-full">
                    <label className="form-label"><MapPin size={14} /> Full Address</label>
                    <input 
                      className="form-input" 
                      placeholder="Enter hospital location" 
                      value={form.address} 
                      onChange={e => updateForm('address', e.target.value)} 
                      required 
                    />
                  </div>
                </>
              )}

              {activeRole === 'patient' && (
                <div className="form-group grid-full">
                  <label className="form-label"><Phone size={14} /> Phone Number</label>
                  <input 
                    className="form-input" 
                    placeholder="e.g., +91 99887 76655" 
                    value={form.phone} 
                    onChange={e => updateForm('phone', e.target.value)} 
                    required 
                  />
                </div>
              )}

              {activeRole === 'ambulance' && (
                <>
                  <div className="form-group">
                    <label className="form-label"><Phone size={14} /> Driver Phone</label>
                    <input 
                      className="form-input" 
                      placeholder="+91 98765 43210" 
                      value={form.phone} 
                      onChange={e => updateForm('phone', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle No.</label>
                    <input 
                      className="form-input" 
                      placeholder="DL-01-AB-1234" 
                      value={form.vehicleNo} 
                      onChange={e => updateForm('vehicleNo', e.target.value)} 
                      required 
                    />
                  </div>
                </>
              )}

              <div className="form-group grid-full">
                <label className="form-label"><Lock size={14} /> Password</label>
                <div className="input-password">
                  <input 
                    className="form-input" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create a strong password" 
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
              {isLoading ? 'Creating Account...' : 'Sign Up Now'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
