import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { LayoutDashboard, AlertCircle, Building2, Ambulance, Activity, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../Dashboard.css';

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/emergency', label: 'Emergency Cases', icon: AlertCircle },
  { path: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
  { path: '/admin/ambulances', label: 'Ambulances', icon: Ambulance },
  { path: '/admin/resources', label: 'Resource Monitor', icon: Activity },
];

const doctorLinks = [
  { path: '/doctor/emergency', label: 'Emergency Cases', icon: AlertCircle },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isDoctor = user?.role === 'doctor';
  const links = isDoctor ? doctorLinks : adminLinks;

  return (
    <div className="dashboard-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      {/* Custom Admin/Doctor Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>{isDoctor ? 'Doctor Panel' : 'Admin Panel'}</h2>
          <button className="btn-icon btn-ghost mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-nav">
          {links.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && link.path !== '/doctor' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <span className="sidebar-link-icon"><link.icon size={20} /></span>
                <span className="sidebar-link-text">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
