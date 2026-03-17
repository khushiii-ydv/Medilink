import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Ambulance as AmbulanceIcon, Phone, MapPin, Building2 } from 'lucide-react';

export default function AdminAmbulances() {
  const { ambulances, hospitals } = useData();
  const [filter, setFilter] = useState('all');

  const filtered = ambulances.filter(a => {
    if (!a) return false;
    if (filter === 'available') return a.status === 'available';
    if (filter === 'on-duty') return a.status === 'on-duty';
    return true;
  });

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Ambulance Fleet Monitoring</h1>
        <p>Live tracking of all emergency vehicles across the MediLink network</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>All Vehicles</button>
            <button className={`btn btn-sm ${filter === 'available' ? 'btn-success' : 'btn-secondary'}`} onClick={() => setFilter('available')}>Available</button>
            <button className={`btn btn-sm ${filter === 'on-duty' ? 'btn-warning' : 'btn-secondary'}`} onClick={() => setFilter('on-duty')}>On Duty</button>
          </div>
          <span className="badge badge-info">{filtered.length} Vehicles</span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Vehicle / Driver</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status & Type</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Affiliated Hospital</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(amb => {
                const hosp = hospitals.find(h => h.id === amb.hospitalId);
                return (
                  <tr key={amb.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-card-icon stat-icon-warning" style={{ width: 40, height: 40 }}>
                          <AmbulanceIcon size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{amb.vehicleNo}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {amb.driverName} • <Phone size={10} /> {amb.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                        <span className={`badge ${amb.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                          <span className={`status-dot ${amb.status === 'available' ? 'online' : 'busy'}`} /> {amb.status}
                        </span>
                        <span className="badge badge-info">{amb.type || 'BLS'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: hosp ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        <Building2 size={16} className="text-primary" /> {hosp ? hosp.name : 'Unassigned'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                        <MapPin size={16} className="text-secondary" /> 
                        <span style={{ fontFamily: 'monospace' }}>{amb.lat.toFixed(4)}, {amb.lng.toFixed(4)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No ambulances match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
