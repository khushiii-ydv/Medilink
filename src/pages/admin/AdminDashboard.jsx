import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import { Building2, Ambulance, AlertOctagon, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { hospitals, ambulances, requests } = useData();
  
  const activeCases = requests.filter(r => r.status === 'pending');
  const criticalCases = activeCases.filter(r => r.urgency === 'critical');
  
  // Real-time calculated overall capacity
  const totalBeds = hospitals.reduce((acc, h) => acc + (h.beds?.total || 0), 0);
  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + (h.beds?.available || 0), 0);
  const availableAmbs = ambulances.filter(a => a.status === 'available').length;

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Admin Overview</h1>
        <p>Platform-wide monitoring and analytics</p>
      </div>

      <div className="dashboard-overview-grid">
        <StatCard icon={Building2} label="Network Hospitals" value={hospitals.length} color="primary" />
        <StatCard icon={Ambulance} label="Active Ambulances" value={availableAmbs} total={ambulances.length} color="info" />
        <StatCard icon={AlertTriangle} label="Active Emergencies" value={activeCases.length} color="warning" />
        <StatCard icon={AlertOctagon} label="Critical Cases" value={criticalCases.length} color="danger" />
      </div>

      <div className="dashboard-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Network Capacity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>General Beds</span>
                <span>{totalAvailableBeds} / {totalBeds} Available</span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (totalAvailableBeds / Math.max(1, totalBeds)) * 100)}%`, backgroundColor: 'var(--primary-500)' }} />
              </div>
            </div>
            
            {/* Quick Summary of Recent Activity */}
            <h3 style={{ marginTop: 16, fontSize: '1rem' }}>Recent Platform Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {requests.slice(0, 3).map(req => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 12, background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{req.type.replace('-', ' ')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(req.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : 'info'}`}>{req.urgency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--danger, #ef4444) 0%, #b91c1c 100%)', color: 'white' }}>
          <h2 style={{ color: 'white', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertOctagon /> Require Immediate Attention
          </h2>
          {criticalCases.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>No critical emergencies at this time. All clear.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {criticalCases.slice(0,4).map(req => (
                <div key={req.id} style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontWeight: 600 }}>{req.from?.name || 'Unknown Patient'}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{req.condition}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>Requested: {hospitals.find(h => h.id === req.toHospitalId)?.name || 'Any Hospital'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
