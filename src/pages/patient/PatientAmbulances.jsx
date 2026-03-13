import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import MapView from '../../components/MapView';
import { Ambulance as AmbIcon, Phone, MapPin, Send, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientAmbulances() {
  const { user } = useAuth();
  const { ambulances, hospitals, createRequest } = useData();
  const [selectedAmb, setSelectedAmb] = useState(null);
  const [reqForm, setReqForm] = useState({ condition: '', pickupLocation: '' });

  const availableAmbs = ambulances.filter(a => a.status === 'available');

  const mapMarkers = [
    ...availableAmbs.map(a => ({
      id: a.id, lat: a.lat, lng: a.lng, type: 'ambulance',
      popup: { title: a.vehicleNo, subtitle: a.driverName, details: [
        { label: 'Type', value: a.type },
        { label: 'Phone', value: a.phone },
        { label: 'Hospital', value: hospitals.find(h => h.id === a.hospitalId)?.name || 'N/A' },
      ] }
    })),
    ...hospitals.map(h => ({
      id: h.id, lat: h.lat, lng: h.lng, type: 'hospital',
      popup: { title: h.name, subtitle: h.address }
    }))
  ];

  const handleRequest = () => {
    if (!selectedAmb) return;
    createRequest({
      type: 'ambulance-request',
      from: { type: 'patient', name: user.name, phone: user.phone, patientId: user.patientId },
      toAmbulanceId: selectedAmb.id,
      toHospitalId: selectedAmb.hospitalId,
      pickupLocation: reqForm.pickupLocation,
      condition: reqForm.condition,
      urgency: 'critical',
    });
    toast.success('Ambulance request sent!');
    setSelectedAmb(null);
    setReqForm({ condition: '', pickupLocation: '' });
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Available Ambulances</h1>
        <p>Find and request nearby ambulances for emergency pickup</p>
      </div>

      <div className="dashboard-section">
        <MapView markers={mapMarkers} center={[20.5937, 78.9629]} zoom={5} height="400px" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <strong>{availableAmbs.length}</strong> ambulances available
        </p>
      </div>

      {/* Request Modal */}
      {selectedAmb && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedAmb(null)}>
          <div className="modal-content">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Request Ambulance - {selectedAmb.vehicleNo}</h3>
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <input className="form-input" placeholder="Enter your location" value={reqForm.pickupLocation} onChange={e => setReqForm({...reqForm, pickupLocation: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Details</label>
              <textarea className="form-textarea" placeholder="Describe the emergency" value={reqForm.condition} onChange={e => setReqForm({...reqForm, condition: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-danger" onClick={handleRequest}><Send size={14} /> Request Now</button>
              <button className="btn btn-ghost" onClick={() => setSelectedAmb(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="ambulance-grid">
        {availableAmbs.map(amb => {
          const hospital = hospitals.find(h => h.id === amb.hospitalId);
          return (
            <div key={amb.id} className="ambulance-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div className="ambulance-icon">
                  <AmbIcon size={22} />
                </div>
                <div className="ambulance-info">
                  <div className="ambulance-vehicle">{amb.vehicleNo}</div>
                  <div className="ambulance-driver">{amb.driverName}</div>
                </div>
                <span className="badge badge-info">{amb.type}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={12} /> {amb.phone}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={12} /> {hospital?.name || 'N/A'}
                </span>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => setSelectedAmb(amb)} style={{ width: '100%' }}>
                <Send size={14} /> Request Ambulance
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
