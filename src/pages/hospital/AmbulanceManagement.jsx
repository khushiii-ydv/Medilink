import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import MapView from '../../components/MapView';
import { Ambulance as AmbulanceIcon, Phone, MapPin } from 'lucide-react';

export default function AmbulanceManagement() {
  const { user } = useAuth();
  const { getAmbulancesByHospital } = useData();
  const allAmbulances = getAmbulancesByHospital(user.hospitalId);
  // Show only up to 5 ambulances as static data in the fleet overview
  const ambulances = allAmbulances.filter(Boolean).slice(0, 5);

  const mapMarkers = ambulances.map(a => ({
    id: a.id,
    lat: a.lat,
    lng: a.lng,
    type: 'ambulance',
    popup: {
      title: a.vehicleNo,
      subtitle: a.driverName,
      details: [
        { label: 'Status', value: a.status === 'available' ? '✅ Available' : '🔴 On Duty' },
        { label: 'Type', value: a.type },
        { label: 'Phone', value: a.phone },
      ]
    }
  }));

  const center = ambulances.length > 0 ? [ambulances[0].lat, ambulances[0].lng] : [20.5937, 78.9629];

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Ambulance Management</h1>
        <p>Track and manage ambulances associated with your hospital</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Fleet Overview</h2>
        </div>
        <div className="ambulance-grid">
          {ambulances.length === 0 ? (
            <div className="empty-state">
              <AmbulanceIcon size={48} />
              <h3>No ambulances registered</h3>
              <p>Ambulances linked to your hospital will appear here</p>
            </div>
          ) : (
            ambulances.map(amb => (
              <div key={amb.id} className="ambulance-card">
                <div className="ambulance-icon">
                  <AmbulanceIcon size={22} />
                </div>
                <div className="ambulance-info">
                  <div className="ambulance-vehicle">{amb.vehicleNo}</div>
                  <div className="ambulance-driver">{amb.driverName}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className={`badge ${amb.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                      <span className={`status-dot ${amb.status === 'available' ? 'online' : 'busy'}`} /> {amb.status}
                    </span>
                    <span className="badge badge-info">{amb.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} /> {amb.phone}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Live Ambulance Tracker</h2>
          <span className="badge badge-info">{ambulances.length} of {allAmbulances.length} Ambulances shown</span>
        </div>
        <MapView markers={mapMarkers} center={center} zoom={11} height="400px" />
      </div>
    </div>
  );
}
