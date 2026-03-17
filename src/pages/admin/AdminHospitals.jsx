import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Building2, CheckCircle2, XCircle, MapPin, Bed, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminHospitals() {
  const { hospitals } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = hospitals.filter(h => 
    h && h.name && h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (hospName, action) => {
    toast.success(`${hospName} ${action} successfully`);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Hospital Network Management</h1>
        <p>Review and manage all registered hospitals on the MediLink platform</p>
      </div>

      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search hospitals..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="badge badge-primary" style={{ fontSize: '1rem', padding: '8px 16px' }}>
            Total: {hospitals.length}
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Hospital Name</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Capacity</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Network Status</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="stat-card-icon stat-icon-primary" style={{ width: 40, height: 40 }}>
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{h.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{h.email} • {h.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                      <MapPin size={14} className="text-secondary" /> 
                      <span style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.address}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bed size={14} className="text-primary" /> {h.beds?.total || 0} Total Beds
                      </div>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity size={14} className="text-danger" /> {h.beds?.icu || 0} ICU Beds
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge badge-success">Active & Verified</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        className="btn-icon btn-ghost" 
                        style={{ color: 'var(--success)', background: 'rgba(34,197,94,0.1)' }}
                        onClick={() => handleAction(h.name, 'approved')}
                        title="Approve Details"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-ghost" 
                        style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)' }}
                        onClick={() => handleAction(h.name, 'suspended')}
                        title="Suspend Account"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No hospitals found matching "{searchTerm}"
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
