import { useData } from '../../context/DataContext';
import { BarChart3, Activity, Clock, Users, Building2, Ambulance, Filter } from 'lucide-react';

export default function AdminAnalytics() {
  const { hospitals, ambulances, requests } = useData();

  // Basic counters
  const totalRequests = requests.length;
  const criticalRequests = requests.filter(r => r.urgency === 'critical').length;
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'accepted').length;
  const activeRequests = requests.filter(r => r.status === 'pending').length;

  // Breakdown by type
  const requestsByType = requests.reduce((acc, req) => {
    acc[req.type] = (acc[req.type] || 0) + 1;
    return acc;
  }, {});

  // Hospital spread (just a simple count per city for demo)
  const hospitalCities = hospitals.reduce((acc, h) => {
    const city = h.address.split(',').pop().trim() || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Platform Analytics</h1>
        <p>System-wide usage statistics and emergency response metrics</p>
      </div>

      <div className="dashboard-overview-grid">
        <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="stat-card-icon stat-icon-primary"><Activity size={20} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Total Cases Handled</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalRequests}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>Since platform launch</div>
        </div>

        <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="stat-card-icon stat-icon-danger"><AlertTriangle size={20} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Critical Ratio</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalRequests > 0 ? Math.round((criticalRequests / totalRequests) * 100) : 0}%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>{criticalRequests} critical emergencies</div>
        </div>

        <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="stat-card-icon stat-icon-success"><Clock size={20} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Resolution Rate</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>{completedRequests} cases resolved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="card">
          <h2 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Filter size={18} /> Request Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(requestsByType).map(([type, count]) => (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                  <span style={{ textTransform: 'capitalize' }}>{type.replace('-', ' ')}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / Math.max(1, totalRequests)) * 100}%`, background: 'var(--primary-500)' }} />
                </div>
              </div>
            ))}
            {Object.keys(requestsByType).length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No request data available.</p>}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={18} /> Network Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Building2 className="text-primary" />
                <span style={{ fontWeight: 600 }}>Registered Hospitals</span>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{hospitals.length}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Ambulance className="text-warning" />
                <span style={{ fontWeight: 600 }}>Network Ambulances</span>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{ambulances.length}</span>
            </div>

            <h3 style={{ fontSize: '0.95rem', marginTop: 8 }}>Regions Covered</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(hospitalCities).map(([city, count]) => (
                <span key={city} className="badge badge-secondary" style={{ padding: '6px 12px' }}>
                  {city}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
