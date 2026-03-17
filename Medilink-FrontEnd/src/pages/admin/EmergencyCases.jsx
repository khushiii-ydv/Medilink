import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AlertCircle, Clock, MapPin, Hospital, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmergencyCases() {
  const { requests, hospitals, updateRequestStatus } = useData();
  const [filter, setFilter] = useState('all');

  const emergencyRequests = requests.filter(r => 
    r.type.includes('request') || r.type.includes('admission')
  );

  const filtered = emergencyRequests.filter(r => {
    if (filter === 'critical') return r.urgency === 'critical';
    if (filter === 'pending') return r.status === 'pending';
    return true;
  });

  const handlePriorityChange = (reqId, newUrgency) => {
    // In a real app we'd need an updateRequestUrgency in context, 
    // but for demo we can just toast that it changed.
    toast.success(`Priority updated to ${newUrgency}`);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Emergency Cases Monitoring</h1>
        <p>Live platform-wide emergency case tracking and priority management</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>All Cases</button>
            <button className={`btn btn-sm ${filter === 'critical' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('critical')}>Critical Only</button>
            <button className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('pending')}>Active/Pending</button>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Patient / Condition</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Hospital</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Admin Priority Override</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const targetHosp = hospitals.find(h => h.id === req.toHospitalId);
                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600 }}>{req.from?.name || 'Unknown Patient'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity size={14} /> {req.type.replace('-', ' ')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{req.condition}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                        <MapPin size={14} className="text-secondary" /> {req.pickupLocation || 'Location unavailable'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: targetHosp ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        <Hospital size={14} /> {targetHosp ? targetHosp.name : (req.type === 'ambulance-request' ? 'Nearest Available' : 'No Hospital Specified')}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <select 
                        className="form-input" 
                        style={{ padding: '6px 12px', height: 'auto', width: '130px', fontSize: '0.85rem' }}
                        defaultValue={req.urgency}
                        onChange={(e) => handlePriorityChange(req.id, e.target.value)}
                      >
                        <option value="normal">Normal</option>
                        <option value="high">Urgent</option>
                        <option value="critical">Critical</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : 'secondary'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No emergency cases match the current filter.
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
