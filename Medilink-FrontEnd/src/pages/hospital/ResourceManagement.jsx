/**
 * ResourceManagement.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart data loading: tries API first, falls back to mockData if unavailable.
 * Saves: tries API first, falls back to DataContext in-memory update.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BLOOD_TYPES } from '../../data/mockData';
import {
  Bed, HeartPulse, Wind, Droplets, Save, Plus,
  UserCheck, UserX, Stethoscope, RefreshCw, Wifi, WifiOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getHospitalById,
  updateHospitalResources,
  updateBloodBank as apiUpdateBloodBank,
  addSpecialist as apiAddSpecialist,
  updateSpecialist as apiUpdateSpecialist,
} from '../../api/hospitalApi';

export default function ResourceManagement() {
  const { user } = useAuth();
  const {
    getHospital: getMockHospital,
    updateHospitalResource: mockUpdateResource,
    updateBloodBank: mockUpdateBloodBank,
    updateSpecialist: mockUpdateSpecialist,
    addSpecialist: mockAddSpecialist,
  } = useData();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddSpecialist, setShowAddSpecialist] = useState(false);
  const [newSpecialist, setNewSpecialist] = useState({ name: '', specialty: '', available: true });
  const [saving, setSaving] = useState(false);

  // ── Fetch data: try API → fallback mock ───────────────────────────────────
  const fetchHospital = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHospitalById(user.hospitalId);
      setHospital(data);
      setIsLiveData(true);
    } catch {
      const mockHosp = getMockHospital(user.hospitalId);
      setHospital(mockHosp || null);
      setIsLiveData(false);
    } finally {
      setLoading(false);
    }
  }, [user.hospitalId]);

  useEffect(() => { fetchHospital(); }, [fetchHospital]);

  // ── Field → API payload key map ───────────────────────────────────────────
  const FIELD_MAP = {
    'beds.total':            'totalBeds',
    'beds.available':        'availableBeds',
    'beds.icu':              'totalIcuBeds',
    'beds.icuAvailable':     'availableIcuBeds',
    'ventilators.total':     'totalVentilators',
    'ventilators.available': 'availableVentilators',
    'oxygen.available':      'oxygenAvailable',
    'oxygen.capacity':       'oxygenCapacity',
  };

  // ── Save resource (API → fallback mock state update) ──────────────────────
  const handleSave = async (field, value) => {
    const intVal = parseInt(value) || 0;
    setSaving(true);
    try {
      if (isLiveData) {
        const backendKey = FIELD_MAP[field];
        const updated = await updateHospitalResources(user.hospitalId, { [backendKey]: intVal });
        setHospital(updated);
      } else {
        // Fallback: update DataContext in-memory state
        mockUpdateResource(user.hospitalId, field, intVal);
        // Also update local state so UI re-renders
        setHospital(prev => {
          if (!prev || !field.includes('.')) return prev;
          const [parent, child] = field.split('.');
          return { ...prev, [parent]: { ...prev[parent], [child]: intVal } };
        });
      }
      toast.success('Resource updated');
    } catch (err) {
      toast.error(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
      setEditing(null);
    }
  };

  // ── Save blood bank (API → fallback mock) ─────────────────────────────────
  const handleBloodSave = async (type, value) => {
    const intVal = parseInt(value) || 0;
    try {
      if (isLiveData) {
        const updated = await apiUpdateBloodBank(user.hospitalId, { [type]: intVal });
        setHospital(updated);
      } else {
        mockUpdateBloodBank(user.hospitalId, type, intVal);
        setHospital(prev => ({
          ...prev,
          bloodBank: { ...prev.bloodBank, [type]: intVal },
        }));
      }
      toast.success(`${type} blood bank updated`);
    } catch (err) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  // ── Add specialist ────────────────────────────────────────────────────────
  const handleAddSpecialist = async () => {
    if (!newSpecialist.name || !newSpecialist.specialty) return;
    setSaving(true);
    try {
      if (isLiveData) {
        await apiAddSpecialist(user.hospitalId, newSpecialist);
        await fetchHospital();
      } else {
        mockAddSpecialist(user.hospitalId, newSpecialist);
        setHospital(prev => ({
          ...prev,
          specialists: [...(prev.specialists || []), { ...newSpecialist, id: 'local_' + Date.now() }],
        }));
      }
      setNewSpecialist({ name: '', specialty: '', available: true });
      setShowAddSpecialist(false);
      toast.success('Specialist added');
    } catch (err) {
      toast.error(`Failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle specialist availability ────────────────────────────────────────
  const handleToggleSpecialist = async (specialist, idx) => {
    const newAvail = !specialist.available;
    try {
      if (isLiveData && specialist.id) {
        await apiUpdateSpecialist(user.hospitalId, specialist.id, { available: newAvail });
      } else {
        mockUpdateSpecialist(user.hospitalId, idx, { available: newAvail });
      }
      // Optimistic update either way
      setHospital(prev => ({
        ...prev,
        specialists: prev.specialists.map((s, i) =>
          (specialist.id ? s.id === specialist.id : i === idx)
            ? { ...s, available: newAvail }
            : s
        ),
      }));
      toast.success(`${specialist.name} marked as ${newAvail ? 'available' : 'unavailable'}`);
    } catch (err) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Loading resources…</p>
      </div>
    );
  }

  if (!hospital) return (
    <div className="empty-state">
      <h3>Hospital not found</h3>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={fetchHospital}>Retry</button>
    </div>
  );

  const resources = [
    { field: 'beds.total',            label: 'Total Beds',            value: hospital.beds?.total ?? 0,             icon: Bed,        color: 'primary' },
    { field: 'beds.available',        label: 'Available Beds',        value: hospital.beds?.available ?? 0,         icon: Bed,        color: 'success' },
    { field: 'beds.icu',              label: 'Total ICU',             value: hospital.beds?.icu ?? 0,               icon: HeartPulse, color: 'danger' },
    { field: 'beds.icuAvailable',     label: 'ICU Available',         value: hospital.beds?.icuAvailable ?? 0,      icon: HeartPulse, color: 'warning' },
    { field: 'ventilators.total',     label: 'Total Ventilators',     value: hospital.ventilators?.total ?? 0,      icon: Wind,       color: 'info' },
    { field: 'ventilators.available', label: 'Available Ventilators', value: hospital.ventilators?.available ?? 0,  icon: Wind,       color: 'primary' },
    { field: 'oxygen.available',      label: 'Oxygen (Liters)',       value: hospital.oxygen?.available ?? 0,       icon: Droplets,   color: 'success' },
    { field: 'oxygen.capacity',       label: 'Oxygen Capacity',       value: hospital.oxygen?.capacity ?? 0,        icon: Droplets,   color: 'info' },
  ];

  return (
    <div>
      <div className="dashboard-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1>Resource Management</h1>
          {/* Live vs Demo badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
            background: isLiveData ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
            color: isLiveData ? '#22c55e' : '#eab308',
            border: `1px solid ${isLiveData ? '#22c55e44' : '#eab30844'}`,
          }}>
            {isLiveData ? <Wifi size={11} /> : <WifiOff size={11} />}
            {isLiveData ? 'Live DB' : 'Demo Mode'}
          </span>
        </div>
        <p>Update and manage your hospital's real-time resource data</p>
      </div>

      {/* Demo mode notice */}
      {!isLiveData && (
        <div style={{
          marginBottom: 16, padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem',
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
          color: 'var(--text-secondary)',
        }}>
          ⚠️ <strong>Demo Mode:</strong> Changes are saved in memory only. To persist data, start the backend and run{' '}
          <code>npm run seed</code> to set up your database.
        </div>
      )}

      {/* ── Beds, Ventilators, Oxygen ─────────────────────────────────────── */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Hospital Resources</h2>
          <button className="btn btn-ghost btn-sm" onClick={fetchHospital}>
            <RefreshCw size={14} /> Refresh
          </button>
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
                  <input
                    type="number" min="0"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSave(res.field, editValue)}
                    disabled={saving}
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => handleSave(res.field, editValue)} disabled={saving}>
                    {saving ? '…' : <><Save size={14} /> Save</>}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
                </div>
              ) : (
                <>
                  <p className="resource-card-value">{Number(res.value).toLocaleString()}</p>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={() => { setEditing(res.field); setEditValue(String(res.value)); }}
                  >Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Blood Bank ───────────────────────────────────────────────────── */}
      <div className="dashboard-section">
        <div className="dashboard-section-header"><h2>Blood Bank</h2></div>
        <div className="blood-grid">
          {BLOOD_TYPES.map(type => (
            <div key={type} className="blood-item">
              <div className="blood-type">{type}</div>
              <div className="blood-units">{hospital.bloodBank?.[type] ?? 0}</div>
              <div className="blood-label">units</div>
              <div className="blood-edit">
                <input
                  type="number" min="0"
                  defaultValue={hospital.bloodBank?.[type] ?? 0}
                  onBlur={e => handleBloodSave(type, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Equipment ────────────────────────────────────────────────────── */}
      {hospital.equipment?.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header"><h2>Medical Equipment</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {hospital.equipment.map((eq, i) => (
              <div key={eq.id ?? i} className="card" style={{ padding: 16 }}>
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
      )}

      {/* ── Specialists ──────────────────────────────────────────────────── */}
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
              <input className="form-input" placeholder="Doctor name" value={newSpecialist.name}
                onChange={e => setNewSpecialist({ ...newSpecialist, name: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
              <label className="form-label">Specialty</label>
              <input className="form-input" placeholder="Specialty" value={newSpecialist.specialty}
                onChange={e => setNewSpecialist({ ...newSpecialist, specialty: e.target.value })} />
            </div>
            <button className="btn btn-accent btn-sm" onClick={handleAddSpecialist} disabled={saving}>
              <Plus size={14} /> {saving ? 'Adding…' : 'Add'}
            </button>
          </div>
        )}

        <div className="specialist-list">
          {hospital.specialists?.length > 0 ? hospital.specialists.map((doc, idx) => (
            <div key={doc.id ?? idx} className="specialist-item">
              <div className="specialist-info">
                <div className="specialist-avatar">
                  {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="specialist-name">{doc.name}</div>
                  <div className="specialist-dept">{doc.specialty}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge ${doc.available ? 'badge-success' : 'badge-danger'}`}>
                  {doc.available ? 'Available' : 'Unavailable'}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => handleToggleSpecialist(doc, idx)}>
                  {doc.available ? <UserX size={14} /> : <UserCheck size={14} />}
                </button>
              </div>
            </div>
          )) : (
            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 24 }}>
              No specialists added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
