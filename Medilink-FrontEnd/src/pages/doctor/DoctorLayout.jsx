import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { LayoutDashboard, Stethoscope, ClipboardList, Settings, X } from 'lucide-react';
import '../Dashboard.css';

const doctorLinks = [
  { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/doctor/requests', label: 'Assigned Requests', icon: ClipboardList },
];

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, background: 'var(--primary-500)', borderRadius: 8, color: 'white' }}>
              <Stethoscope size={20} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Doc Panel</h2>
          </div>
          <button className="btn-icon btn-ghost mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-nav">
          {doctorLinks.map(link => {
            const isActive = location.pathname === link.path;
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
