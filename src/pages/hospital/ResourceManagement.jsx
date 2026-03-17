import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BLOOD_TYPES } from '../../data/mockData';
import { Bed, HeartPulse, Wind, Droplets, Save, Plus, UserCheck, UserX, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResourceManagement() {
  const { user } = useAuth();
  const { getHospital, updateHospitalResource, updateBloodBank, updateSpecialist, addSpecialist } = useData();
  const hospital = getHospital(user.hospitalId);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddSpecialist, setShowAddSpecialist] = useState(false);
  const [newSpecialist, setNewSpecialist] = useState({ name: '', specialty: '', available: true });

  if (!hospital) return null;

  const handleSave = (field, value) => {
    updateHospitalResource(user.hospitalId, field, parseInt(value) || 0);
    setEditing(null);
    toast.success('Resource updated successfully');
  };

  const handleBloodSave = (type, value) => {
    updateBloodBank(user.hospitalId, type, parseInt(value) || 0);
    toast.success(`${type} blood bank updated`);
  };

  const handleAddSpecialist = () => {
    if (newSpecialist.name && newSpecialist.specialty) {
      addSpecialist(user.hospitalId, newSpecialist);
      setNewSpecialist({ name: '', specialty: '', available: true });
      setShowAddSpecialist(false);
      toast.success('Specialist added');
    }
  };

  const resources = [
    { field: 'beds.total', label: 'Total Beds', value: hospital.beds.total, icon: Bed, color: 'primary' },
    { field: 'beds.available', label: 'Available Beds', value: hospital.beds.available, icon: Bed, color: 'success' },
    { field: 'beds.icu', label: 'Total ICU', value: hospital.beds.icu, icon: HeartPulse, color: 'danger' },
    { field: 'beds.icuAvailable', label: 'ICU Available', value: hospital.beds.icuAvailable, icon: HeartPulse, color: 'warning' },
    { field: 'ventilators.total', label: 'Total Ventilators', value: hospital.ventilators.total, icon: Wind, color: 'info' },
    { field: 'ventilators.available', label: 'Available Ventilators', value: hospital.ventilators.available, icon: Wind, color: 'primary' },
    { field: 'oxygen.available', label: 'Oxygen (Liters)', value: hospital.oxygen.available, icon: Droplets, color: 'success' },
    { field: 'oxygen.capacity', label: 'Oxygen Capacity', value: hospital.oxygen.capacity, icon: Droplets, color: 'info' },
  ];

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Resource Management</h1>
        <p>Update and manage your hospital's real-time resource data</p>
      </div>

      {/* Beds, Ventilators, Oxygen */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Hospital Resources</h2>
        </div>
        <div className="resource-grid">
          {resources.map(res => (
            <div key={res.field} className="resource-card">
              <div className="resource-card-header">
                <span className="resource-card-title">{res.label}</span>
                <div className={`stat-card-icon stat-icon-${res.color}`} style={{ width: 36, height: 36 }}>
                  <res.icon size={18} />
                </div>
              </div>
              {editing === res.field ? (
                <div className="resource-card-edit">
                  <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && handleSave(res.field, editValue)} />
                  <button className="btn btn-primary btn-sm" onClick={() => handleSave(res.field, editValue)}><Save size={14} /> Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <p className="resource-card-value">{res.value.toLocaleString()}</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => { setEditing(res.field); setEditValue(res.value.toString()); }}>Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blood Bank */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Blood Bank</h2>
        </div>
        <div className="blood-grid">
          {BLOOD_TYPES.map(type => (
            <div key={type} className="blood-item">
              <div className="blood-type">{type}</div>
              <div className="blood-units">{hospital.bloodBank[type]}</div>
              <div className="blood-label">units</div>
              <div className="blood-edit">
                <input type="number" defaultValue={hospital.bloodBank[type]} onBlur={e => handleBloodSave(type, e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBloodSave(type, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Medical Equipment</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {hospital.equipment.map((eq, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Equipment Name</div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 8 }}>{eq.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Model Number</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{eq.model}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Available Units</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-500)' }}>{eq.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialists */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2><Stethoscope size={20} /> Specialist Doctors</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddSpecialist(!showAddSpecialist)}>
            <Plus size={14} /> Add Specialist
          </button>
        </div>

        {showAddSpecialist && (
          <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="Doctor name" value={newSpecialist.name} onChange={e => setNewSpecialist({...newSpecialist, name: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
              <label className="form-label">Specialty</label>
              <input className="form-input" placeholder="Specialty" value={newSpecialist.specialty} onChange={e => setNewSpecialist({...newSpecialist, specialty: e.target.value})} />
            </div>
            <button className="btn btn-accent btn-sm" onClick={handleAddSpecialist}><Plus size={14} /> Add</button>
          </div>
        )}

        <div className="specialist-list">
          {hospital.specialists.map((doc, idx) => (
            <div key={idx} className="specialist-item">
              <div className="specialist-info">
                <div className="specialist-avatar">{doc.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                <div>
                  <div className="specialist-name">{doc.name}</div>
                  <div className="specialist-dept">{doc.specialty}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge ${doc.available ? 'badge-success' : 'badge-danger'}`}>
                  {doc.available ? 'Available' : 'Unavailable'}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  updateSpecialist(user.hospitalId, idx, { available: !doc.available });
                  toast.success(`${doc.name} marked as ${!doc.available ? 'available' : 'unavailable'}`);
                }}>
                  {doc.available ? <UserX size={14} /> : <UserCheck size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
