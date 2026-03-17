import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BLOOD_TYPES } from '../../data/mockData';
import MapView from '../../components/MapView';
import { MapPin, Phone, Mail, Star, Bed, HeartPulse, Wind, Droplets, UserCheck, ArrowLeft, Send, Stethoscope, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getHospital, createRequest } = useData();
  const hospital = getHospital(id);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqForm, setReqForm] = useState({ condition: '', urgency: 'medium', notes: '' });

  if (!hospital) return (
    <div className="empty-state">
      <h3>Hospital not found</h3>
      <Link to="/patient/search" className="btn btn-primary">Back to Search</Link>
    </div>
  );

  const handleRequest = () => {
    createRequest({
      type: 'patient-admission',
      from: { type: 'patient', name: user.name, phone: user.phone, patientId: user.patientId },
      toHospitalId: hospital.id,
      urgency: reqForm.urgency,
      condition: reqForm.condition,
      notes: reqForm.notes,
    });
    toast.success('Admission request sent!');
    setShowRequestForm(false);
    setReqForm({ condition: '', urgency: 'medium', notes: '' });
  };

  const mapMarkers = [{ id: hospital.id, lat: hospital.lat, lng: hospital.lng, type: 'hospital', popup: { title: hospital.name, subtitle: hospital.address } }];

  return (
    <div>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="detail-hero">
        <img src={hospital.image} alt={hospital.name} />
        <div className="detail-hero-overlay">
          <div className="detail-hero-info">
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-primary">{hospital.accreditation}</span>
              <span className="hospital-card-rating badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                <Star size={14} fill="var(--warning)" color="var(--warning)" /> {hospital.rating}
              </span>
            </div>
            <h1>{hospital.name}</h1>
            <p><MapPin size={14} style={{ display: 'inline' }} /> {hospital.address}</p>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          {/* Resources */}
          <div className="detail-section">
            <h2><Bed size={20} /> Resource Availability</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { label: 'Total Beds', value: hospital.beds.total, avail: hospital.beds.available, icon: Bed, color: 'primary' },
                { label: 'ICU Beds', value: hospital.beds.icu, avail: hospital.beds.icuAvailable, icon: HeartPulse, color: 'danger' },
                { label: 'Ventilators', value: hospital.ventilators.total, avail: hospital.ventilators.available, icon: Wind, color: 'warning' },
                { label: 'Oxygen', value: hospital.oxygen.capacity, avail: hospital.oxygen.available, icon: Droplets, color: 'info', suffix: 'L' },
              ].map((res, i) => (
                <div key={i} className="resource-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="resource-card-title" style={{ fontSize: '0.8rem' }}>{res.label}</span>
                    <div className={`stat-card-icon stat-icon-${res.color}`} style={{ width: 32, height: 32 }}>
                      <res.icon size={16} />
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.5rem' }}>
                    {res.avail.toLocaleString()}{res.suffix || ''}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 4 }}>/ {res.value.toLocaleString()}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Blood Bank */}
          <div className="detail-section">
            <h2><Droplets size={20} /> Blood Bank</h2>
            <div className="blood-grid">
              {BLOOD_TYPES.map(type => (
                <div key={type} className="blood-item">
                  <div className="blood-type">{type}</div>
                  <div className="blood-units">{hospital.bloodBank[type]}</div>
                  <div className="blood-label">units</div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="detail-section">
            <h2><Shield size={20} /> Medical Equipment</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {hospital.equipment.map(eq => (
                <span key={eq.name} className="badge badge-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>{eq.name}</span>
              ))}
            </div>
          </div>

          {/* Specialists */}
          <div className="detail-section">
            <h2><Stethoscope size={20} /> Specialist Doctors</h2>
            <div className="specialist-list">
              {hospital.specialists.map((doc, i) => (
                <div key={i} className="specialist-item">
                  <div className="specialist-info">
                    <div className="specialist-avatar">{doc.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                    <div>
                      <div className="specialist-name">{doc.name}</div>
                      <div className="specialist-dept">{doc.specialty}</div>
                    </div>
                  </div>
                  <span className={`badge ${doc.available ? 'badge-success' : 'badge-danger'}`}>
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact */}
          <div className="detail-section">
            <h2>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                <Phone size={16} style={{ color: 'var(--primary-500)' }} />
                <span>{hospital.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-500)' }} />
                <span>{hospital.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary-500)' }} />
                <span>{hospital.address}</span>
              </div>
            </div>
          </div>

          {/* Request Admission */}
          <div className="detail-section">
            {!showRequestForm ? (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowRequestForm(true)} id="request-admission-btn">
                <Send size={16} /> Request Admission
              </button>
            ) : (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Request Admission</h3>
                <div className="form-group">
                  <label className="form-label">Patient Condition</label>
                  <textarea className="form-textarea" placeholder="Describe your condition" value={reqForm.condition} onChange={e => setReqForm({...reqForm, condition: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-select" value={reqForm.urgency} onChange={e => setReqForm({...reqForm, urgency: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <input className="form-input" placeholder="Any details" value={reqForm.notes} onChange={e => setReqForm({...reqForm, notes: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleRequest}><Send size={14} /> Send</button>
                  <button className="btn btn-ghost" onClick={() => setShowRequestForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="detail-section">
            <h2><MapPin size={20} /> Location</h2>
            <MapView markers={mapMarkers} center={[hospital.lat, hospital.lng]} zoom={14} height="250px" />
          </div>
        </div>
      </div>
    </div>
  );
}
