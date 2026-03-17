import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Ambulance as AmbIcon, Phone } from 'lucide-react';

export default function AmbulanceFleet() {
  const { user } = useAuth();
  const { getAmbulancesByHospital, getHospital } = useData();
  const ambulances = getAmbulancesByHospital(user.hospitalId);
  const hospital = getHospital(user.hospitalId);

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Ambulance Fleet</h1>
        <p>All ambulances from {hospital?.name || 'your hospital'}</p>
      </div>
      <div className="ambulance-grid">
        {ambulances.length === 0 ? (
          <div className="empty-state">
            <AmbIcon size={48} />
            <h3>No fleet data</h3>
          </div>
        ) : ambulances.map(amb => (
          <div key={amb.id} className="ambulance-card">
            <div className="ambulance-icon">
              <AmbIcon size={22} />
            </div>
            <div className="ambulance-info">
              <div className="ambulance-vehicle">{amb.vehicleNo}</div>
              <div className="ambulance-driver">{amb.driverName}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                <span className={`badge ${amb.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                  <span className={`status-dot ${amb.status === 'available' ? 'online' : 'busy'}`} /> {amb.status}
                </span>
                <span className="badge badge-info">{amb.type}</span>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Phone size={12} /> {amb.phone}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
