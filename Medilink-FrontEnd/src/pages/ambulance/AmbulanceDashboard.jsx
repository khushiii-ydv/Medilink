import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import MapView from '../../components/MapView';
import { Ambulance as AmbIcon, HeartPulse, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AmbulanceDashboard() {
  const {
    fetchMyAmbulance,
    fetchMyHospital,
    fetchAmbulanceRequests,
    fetchAmbulancesByHospital,
    updateAmbulanceStatus,
  } = useData();

  const [ambulance, setAmbulance] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [requests, setRequests] = useState([]);
  const [fleetAmbulances, setFleetAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const amb = await fetchMyAmbulance();
      setAmbulance(amb);

      const hosp = await fetchMyHospital();
      setHospital(hosp);

      const reqs = await fetchAmbulanceRequests();
      setRequests(reqs);

      if (amb?.hospitalId) {
        const fleet = await fetchAmbulancesByHospital(amb.hospitalId);
        setFleetAmbulances(fleet);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ambulance dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <div className="empty-state"><h3>Loading dashboard...</h3></div>;
  if (!ambulance) return <div className="empty-state"><h3>Ambulance not found</h3></div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const toggleStatus = async () => {
    try {
      const newStatus = ambulance.status === 'available' ? 'on-duty' : 'available';
      const updated = await updateAmbulanceStatus(ambulance.id, newStatus);
      setAmbulance(updated);
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const mapMarkers = [{
    id: ambulance.id,
    lat: ambulance.lat,
    lng: ambulance.lng,
    type: 'ambulance',
    popup: {
      title: ambulance.vehicleNo,
      subtitle: ambulance.driverName,
      details: [
        { label: 'Status', value: ambulance.status === 'available' ? '✅ Available' : ambulance.status === 'on-duty' ? '🔴 On Duty' : '⚫ Offline' },
        { label: 'Type', value: ambulance.type },
      ]
    }
  }];

  if (hospital) {
    mapMarkers.push({
      id: hospital.id,
      lat: hospital.lat,
      lng: hospital.lng,
      type: 'hospital',
      popup: { title: hospital.name, subtitle: hospital.address }
    });
  }

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Welcome, {ambulance.driverName}</h1>
        <p>Ambulance {ambulance.vehicleNo} • {hospital?.name}</p>
      </div>

      <div className="dashboard-overview-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard icon={AmbIcon} label="Vehicle" value={ambulance.vehicleNo || 'N/A'} color="danger" />
        <StatCard icon={HeartPulse} label="Pending Requests" value={pendingRequests.length} color="warning" />
        <StatCard icon={AlertTriangle} label="Fleet Size" value={fleetAmbulances.length} color="info" />
      </div>

      <div className="dashboard-section">
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 28 }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Current Status</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toggle your availability for emergency dispatch</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className={`badge ${ambulance.status === 'available' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              <span className={`status-dot ${ambulance.status === 'available' ? 'online' : 'busy'}`} />
              {ambulance.status === 'available' ? ' Available' : ambulance.status === 'on-duty' ? ' On Duty' : ' Offline'}
            </span>
            <div className="toggle-switch" onClick={toggleStatus}>
              <div className={`toggle-track ${ambulance.status === 'available' ? 'active' : ''}`}>
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Current Location</h2>
        </div>
        <MapView markers={mapMarkers} center={[ambulance.lat, ambulance.lng]} zoom={13} height="350px" />
      </div>

      <div className="dashboard-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Vehicle Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vehicle No</span>
                <span style={{ fontWeight: 600 }}>{ambulance.vehicleNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Type</span>
                <span className="badge badge-info">{ambulance.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone</span>
                <span style={{ fontWeight: 600 }}>{ambulance.phone}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Hospital</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Name</span>
                <span style={{ fontWeight: 600 }}>{hospital?.name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone</span>
                <span style={{ fontWeight: 600 }}>{hospital?.phone || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Address</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem', textAlign: 'right', maxWidth: 220 }}>{hospital?.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}