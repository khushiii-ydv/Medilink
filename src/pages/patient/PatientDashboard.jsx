import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import MapView from '../../components/MapView';
import { Building2, Ambulance, Search, ClipboardList, ArrowRight } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { hospitals, ambulances, getPatientRequests } = useData();
  const myRequests = getPatientRequests(user.patientId);
  const totalBeds = hospitals.reduce((sum, h) => sum + h.beds.available, 0);
  const availableAmbs = ambulances.filter(a => a.status === 'available').length;

  const hospitalMarkers = hospitals.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    type: 'hospital',
    popup: {
      title: h.name,
      subtitle: h.address,
      details: [
        { label: 'Beds', value: h.beds.available },
        { label: 'ICU', value: h.beds.icuAvailable },
        { label: 'Ventilators', value: h.ventilators.available },
      ]
    }
  }));

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Hello, {user.name}!</h1>
        <p>Find hospitals, request admissions, and locate ambulances</p>
      </div>

      <div className="dashboard-overview-grid">
        <StatCard icon={Building2} label="Hospitals in Network" value={hospitals.length} color="primary" />
        <StatCard icon={Search} label="Total Beds Available" value={totalBeds} color="success" />
        <StatCard icon={Ambulance} label="Ambulances Available" value={availableAmbs} color="danger" />
        <StatCard icon={ClipboardList} label="My Requests" value={myRequests.length} color="info" />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { to: '/patient/search', icon: Search, title: 'Search Hospitals', desc: 'Find hospitals with available resources', color: 'primary' },
            { to: '/patient/ambulances', icon: Ambulance, title: 'Find Ambulances', desc: 'Locate nearby available ambulances', color: 'danger' },
            { to: '/patient/my-requests', icon: ClipboardList, title: 'My Requests', desc: 'View your admission requests', color: 'info' },
          ].map((action, i) => (
            <Link key={i} to={action.to} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, textDecoration: 'none', cursor: 'pointer' }}>
              <div className={`stat-card-icon stat-icon-${action.color}`} style={{ width: 48, height: 48 }}>
                <action.icon size={22} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{action.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{action.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary-500)', fontSize: '0.85rem', fontWeight: 600 }}>
                Go <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* My Recent Requests */}
      {myRequests.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Requests</h2>
            <Link to="/patient/my-requests" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="request-list">
            {myRequests.slice(0, 3).map(req => (
              <div key={req.id} className="request-card">
                <div className="request-card-header">
                  <h3>{req.type === 'patient-admission' ? 'Admission Request' : 'Ambulance Request'}</h3>
                  <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
                </div>
                {req.condition && <div className="request-condition">{req.condition}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Hospitals Near You</h2>
        </div>
        <MapView markers={hospitalMarkers} center={[20.5937, 78.9629]} zoom={5} height="400px" />
      </div>
    </div>
  );
}
