import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Ambulance as AmbIcon, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AmbulanceFleet() {
  const { fetchMyAmbulance, fetchMyHospital, fetchAmbulancesByHospital } = useData();

  const [ambulances, setAmbulances] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        setLoading(true);
        const amb = await fetchMyAmbulance();
        const hosp = await fetchMyHospital();
        setHospital(hosp);

        if (amb?.hospitalId) {
          const fleet = await fetchAmbulancesByHospital(amb.hospitalId);
          setAmbulances(fleet);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load ambulance fleet');
      } finally {
        setLoading(false);
      }
    };

    loadFleet();
  }, []);

  if (loading) {
    return <div className="empty-state"><h3>Loading fleet...</h3></div>;
  }

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