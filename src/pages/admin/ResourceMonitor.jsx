import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Activity, AlertTriangle, Bed, Droplets, Wind, Hospital } from 'lucide-react';

// Help helper to get color based on percentage
const getStatusColor = (current, total) => {
  if (!total) return 'secondary';
  const pct = (current / total) * 100;
  if (pct < 20) return 'danger';
  if (pct < 50) return 'warning';
  return 'success';
};

export default function ResourceMonitor() {
  const { hospitals } = useData();
  const [filter, setFilter] = useState('all');

  const monitorData = hospitals.filter(Boolean).map(h => {
    const icuTotal = h.beds?.icu || 0;
    const icuAvail = h.beds?.icuAvailable || 0;
    const oxyTotal = h.oxygen?.capacity || 0;
    const oxyAvail = h.oxygen?.available || 0;
    const ventTotal = h.ventilators?.total || 0;
    const ventAvail = h.ventilators?.available || 0;

    const icuColor = getStatusColor(icuAvail, icuTotal);
    const oxyColor = getStatusColor(oxyAvail, oxyTotal);
    const ventColor = getStatusColor(ventAvail, ventTotal);

    const isCritical = icuColor === 'danger' || oxyColor === 'danger' || ventColor === 'danger';
    
    return { h, icuAvail, icuTotal, icuColor, oxyAvail, oxyTotal, oxyColor, ventAvail, ventTotal, ventColor, isCritical };
  });

  const filtered = monitorData.filter(item => {
    if (filter === 'critical') return item.isCritical;
    return true;
  });

  // Sort by most critical first
  filtered.sort((a, b) => b.isCritical - a.isCritical);

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Resource Risk Monitor</h1>
        <p>Proactively track and manage network-wide critical resource shortages</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>All Facilities</button>
            <button className={`btn btn-sm ${filter === 'critical' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setFilter('critical')}>
              <AlertTriangle size={14} style={{ marginRight: 6 }} /> Critical Risk
            </button>
          </div>
          <span className="badge badge-info">{filtered.length} Monitored</span>
        </div>

        <div className="ambulance-grid">
          {filtered.map(data => (
            <div key={data.h.id} className="card" style={{ borderColor: data.isCritical ? 'var(--danger)' : 'var(--border-color)', borderWidth: data.isCritical ? 2 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Hospital size={18} className="text-primary" /> {data.h.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{data.h.city}</p>
                </div>
                {data.isCritical && <span className="badge badge-danger">High Risk</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* ICU Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={14} /> ICU Beds</span>
                    <span style={{ fontWeight: 600, color: `var(--${data.icuColor})` }}>{data.icuAvail} / {data.icuTotal}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (data.icuAvail / Math.max(1, data.icuTotal)) * 100)}%`, background: `var(--${data.icuColor})` }} />
                  </div>
                </div>

                {/* Oxygen Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Droplets size={14} /> Oxygen</span>
                    <span style={{ fontWeight: 600, color: `var(--${data.oxyColor})` }}>{data.oxyAvail} / {data.oxyTotal} L</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (data.oxyAvail / Math.max(1, data.oxyTotal)) * 100)}%`, background: `var(--${data.oxyColor})` }} />
                  </div>
                </div>

                {/* Ventilator Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Wind size={14} /> Ventilators</span>
                    <span style={{ fontWeight: 600, color: `var(--${data.ventColor})` }}>{data.ventAvail} / {data.ventTotal}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (data.ventAvail / Math.max(1, data.ventTotal)) * 100)}%`, background: `var(--${data.ventColor})` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <Activity size={48} />
              <h3>No facilities found</h3>
              <p>No facilities match the current risk filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
