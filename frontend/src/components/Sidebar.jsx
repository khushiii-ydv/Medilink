import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Bed, HeartPulse, Ambulance, Users, Send, Inbox,
  Search, MapPin, Phone, Activity, ClipboardList
} from 'lucide-react';
import './Sidebar.css';

const hospitalLinks = [
  { to: '/hospital', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/hospital/resources', label: 'Resource Management', icon: Bed },
  { to: '/hospital/requests', label: 'Hospital Requests', icon: Send },
  { to: '/hospital/patient-requests', label: 'Patient Requests', icon: Inbox },
  { to: '/hospital/ambulances', label: 'Ambulance Management', icon: Ambulance },
];

const ambulanceLinks = [
  { to: '/ambulance', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ambulance/requests', label: 'Emergency Requests', icon: HeartPulse },
  { to: '/ambulance/fleet', label: 'Ambulance Fleet', icon: Ambulance },
];

const patientLinks = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/search', label: 'Search Hospitals', icon: Search },
  { to: '/patient/ambulances', label: 'Ambulances', icon: Ambulance },
  { to: '/patient/my-requests', label: 'My Requests', icon: ClipboardList },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const links = user?.role === 'hospital' ? hospitalLinks
    : user?.role === 'ambulance' ? ambulanceLinks
    : patientLinks;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-section-title">Main Menu</div>
          <nav className="sidebar-nav">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
                id={`sidebar-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <Activity size={14} className="pulse-dot" />
            <span>System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}
