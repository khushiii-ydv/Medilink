import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import MapView from '../../components/MapView';
import { Bed, HeartPulse, Wind, Droplets, Ambulance, Users, Clock, AlertTriangle } from 'lucide-react';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const { getHospital, getAmbulancesByHospital, getHospitalRequests, hospitals } = useData();
  const hospital = getHospital(user.hospitalId);
  const ambulances = getAmbulancesByHospital(user.hospitalId);
  const requests = getHospitalRequests(user.hospitalId);
  const pendingRequests = requests.filter(r => r.status === 'pending');

  if (!hospital) return <div className="empty-state"><h3>Hospital not found</h3></div>;

  const mapMarkers = hospitals.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    type: 'hospital',
    popup: {
      title: h.name,
      subtitle: h.address,
      details: [
        { label: 'Beds Available', value: h.beds.available },
        { label: 'ICU Available', value: h.beds.icuAvailable },
        { label: 'Ventilators', value: h.ventilators.available },
      ]
    }
  }));

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Welcome, {hospital.name}</h1>
        <p>Here's your hospital overview for today</p>
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

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Hospital Network Map</h2>
        </div>
        <MapView markers={mapMarkers} center={[hospital.lat, hospital.lng]} zoom={6} height="400px" />
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
    </div>
  );
}
