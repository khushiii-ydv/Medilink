import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import MapView from '../../components/MapView';
import { Bed, HeartPulse, Wind, Droplets, Ambulance, Users, Clock, AlertTriangle, Building2 } from 'lucide-react';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const { getHospital, getAmbulancesByHospital, getHospitalRequests, hospitals } = useData();
  const hospital = getHospital(user.hospitalId);
  const ambulances = getAmbulancesByHospital(user.hospitalId);
  const requests = getHospitalRequests(user.hospitalId);
  const pendingRequests = requests.filter(r => r.status === 'pending');

  if (!hospital) return <div className="empty-state"><h3>Hospital not found</h3></div>;

  // Nearby hospitals = all others in the network (filter out any malformed entries), cap at 9
  const nearbyHospitals = hospitals
    .filter(h => h && h.id !== hospital.id && h.beds && h.ventilators)
    .slice(0, 9);

  const mapMarkers = hospitals
    .filter(h => h && h.lat && h.lng && h.beds && h.ventilators)
    .map(h => ({
      id: h.id,
      lat: h.lat,
      lng: h.lng,
      type: 'hospital',
      popup: {
        title: h.name,
        subtitle: h.address,
        details: [
          { label: 'Beds Available', value: h.beds?.available ?? 'N/A' },
          { label: 'ICU Available', value: h.beds?.icuAvailable ?? 'N/A' },
          { label: 'Ventilators', value: h.ventilators?.available ?? 'N/A' },
        ]
      }
    }));

  return (
    <div>
      {/* 1. Large bold hospital name header with highlight */}
      <div className="dashboard-page-header" style={{ paddingBottom: 8 }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, var(--primary-500, #3b82f6) 0%, #6366f1 100%)',
          borderRadius: 14,
          padding: '10px 28px',
          marginBottom: 12,
          boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
        }}>
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}>
            🏥 {hospital.name}
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4 }}>Here's your hospital overview for today</p>
      </div>

      <div className="dashboard-overview-grid">
        <StatCard icon={Bed} label="Beds Available" value={hospital.beds.available} total={hospital.beds.total} color="primary" />
        <StatCard icon={HeartPulse} label="ICU Beds" value={hospital.beds.icuAvailable} total={hospital.beds.icu} color="danger" />
        <StatCard icon={Wind} label="Ventilators" value={hospital.ventilators.available} total={hospital.ventilators.total} color="warning" />
        <StatCard icon={Droplets} label="Oxygen Supply" value={hospital.oxygen.available} total={hospital.oxygen.capacity} color="info" suffix="L" />
      </div>

      <div className="dashboard-overview-grid">
        <StatCard icon={Ambulance} label="Ambulances" value={ambulances.filter(a => a.status === 'available').length} total={ambulances.length} color="danger" />
        <StatCard icon={Users} label="Specialists Online" value={hospital.specialists.filter(s => s.available).length} total={hospital.specialists.length} color="success" />
        <StatCard icon={AlertTriangle} label="Pending Requests" value={pendingRequests.length} color="warning" />
        <StatCard icon={Clock} label="Accreditation" value={0} color="primary" />
      </div>

      {pendingRequests.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Pending Requests ({pendingRequests.length})</h2>
          </div>
          <div className="request-list">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="request-card">
                <div className="request-card-header">
                  <h3>{req.type === 'patient-admission' ? 'Patient Admission' : req.type === 'hospital-transfer' ? 'Hospital Transfer' : req.type === 'blood-request' ? 'Blood Request' : 'Ambulance Request'}</h3>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>{req.urgency}</span>
                </div>
                <div className="request-meta">
                  <span className="request-meta-item"><Users size={14} /> {req.from?.name}</span>
                  <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
                </div>
                {req.condition && <div className="request-condition">{req.condition}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Nearby Hospitals section — appears BEFORE the map */}
      {nearbyHospitals.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2><Building2 size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />Nearby Hospitals</h2>
            <span className="badge badge-info">{nearbyHospitals.length} hospitals in network</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {nearbyHospitals.map(h => {
              const hAmbs = hospitals.find(x => x.id === h.id);
              return (
                <div key={h.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div className="stat-card-icon stat-icon-primary" style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{h.name}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{h.accreditation}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { icon: HeartPulse, label: 'ICU Beds', value: h.beds?.icuAvailable ?? 'N/A', color: 'danger' },
                      { icon: Bed, label: 'Gen. Beds', value: h.beds?.available ?? 'N/A', color: 'primary' },
                      { icon: Wind, label: 'Ventilators', value: h.ventilators?.available ?? 'N/A', color: 'warning' },
                      { icon: Ambulance, label: 'Ambulances', value: '–', color: 'info' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <item.icon size={14} style={{ color: `var(--${item.color === 'primary' ? 'primary-500' : item.color})` }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.label}</div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {item.label === 'Ambulances' ? h.beds.available : item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map appears at the bottom */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Hospital Network Map</h2>
        </div>
        <MapView markers={mapMarkers} center={[hospital.lat, hospital.lng]} zoom={6} height="400px" />
      </div>
    </div>
  );
}
