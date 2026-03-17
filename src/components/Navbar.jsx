import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Bell, Moon, Sun, LogOut, Menu, X, Activity, CreditCard } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, clearNotifications } = useData();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('medilink_theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('medilink_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      setDarkMode(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const colors = { 
      hospital: 'badge-info', 
      ambulance: 'badge-warning', 
      patient: 'badge-success',
      admin: 'badge-danger'
    };
    return <span className={`badge ${colors[user.role]}`}>{user.role}</span>;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button className="btn-icon btn-ghost sidebar-toggle" onClick={onToggleSidebar} id="sidebar-toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <div className="logo-icon">
            <Activity size={24} />
          </div>
          <span className="logo-text">Medi<span className="logo-highlight">Link</span></span>
        </Link>
      </div>

      <div className="navbar-right">
        <button className="btn-icon btn-ghost theme-toggle" onClick={toggleDark} id="theme-toggle" data-tooltip={darkMode ? 'Light Mode' : 'Dark Mode'}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <>
            {user.role === 'hospital' && (
              <Link to="/plans" className="btn-icon btn-ghost" data-tooltip="Subscription Plans" style={{ marginRight: 8, color: 'var(--primary-500)' }}>
                <CreditCard size={18} />
              </Link>
            )}

            <div className="notif-wrapper" ref={notifRef}>
              <button className="btn-icon btn-ghost notif-btn" onClick={() => setShowNotifs(!showNotifs)} id="notifications-btn">
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={clearNotifications}>Mark all read</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <p className="notif-empty">No notifications</p>
                    ) : notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotificationRead(n.id)}>
                        <div className="notif-dot" />
                        <div>
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-msg">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper" ref={profileRef}>
              <button className="profile-btn" onClick={() => setShowProfile(!showProfile)} id="profile-btn">
                <div className="avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                <div className="profile-info">
                  <span className="profile-name">{user.name}</span>
                  {getRoleBadge()}
                </div>
              </button>
              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="avatar avatar-lg">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                    <div>
                      <p className="profile-dropdown-name">{user.name}</p>
                      <p className="profile-dropdown-role">{user.role}</p>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <button className="profile-dropdown-item danger" onClick={handleLogout} id="logout-btn">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <div className="navbar-auth-btns">
            <Link to="/login" className="btn btn-ghost btn-sm" id="login-nav-btn">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="register-nav-btn">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
