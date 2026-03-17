import { useState, useEffect } from 'react';
import { getAssignedRequests, resolvePriority } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import { Clock, AlertCircle, CheckCircle2, RefreshCw, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getAssignedRequests();
      setRequests(data);
    } catch (err) {
      toast.error('Failed to load assigned requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResolve = async (id, priority) => {
    try {
      await resolvePriority(id, priority);
      toast.success('Priority resolved and forwarded');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to resolve priority');
    }
  };

  if (loading) return (
    <div className="empty-state">
      <RefreshCw size={40} className="spin" style={{ color: 'var(--primary-500)' }} />
      <p>Loading assigned cases...</p>
    </div>
  );

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Doctor Dashboard</h1>
        <p>Resolve priority conflicts for assigned patient requests</p>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2><AlertCircle size={20} /> Assigned Requests ({requests.length})</h2>
          <button className="btn btn-ghost btn-sm" onClick={fetchRequests}><RefreshCw size={14} /></button>
        </div>

        <div className="request-list">
          {requests.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 200 }}>
              <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
              <h3>All clear!</h3>
              <p>No pending priority conflicts assigned to you.</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="request-card" style={{ borderLeft: `4px solid var(--${req.priority === 'CRITICAL' ? 'danger' : 'warning'})` }}>
                <div className="request-card-header">
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{req.patientName}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Hospital: <strong>{req.hospital?.name}</strong>
                    </div>
                  </div>
                  <span className={`badge badge-${req.priority === 'CRITICAL' ? 'danger' : req.priority === 'HIGH' ? 'warning' : 'info'}`}>
                    Current: {req.priority}
                  </span>
                </div>

                <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Condition</div>
                  <div style={{ fontSize: '1rem' }}>{req.condition}</div>
                </div>

                <div className="request-meta" style={{ marginTop: 16 }}>
                  <span className="request-meta-item"><Clock size={14} /> Assigned: {new Date(req.updatedAt).toLocaleString()}</span>
                </div>

                <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => handleResolve(req.id, 'CRITICAL')}>
                    Mark Critical
                  </button>
                  <button className="btn btn-warning" onClick={() => handleResolve(req.id, 'HIGH')}>
                    Mark High Priority
                  </button>
                  <button className="btn btn-info" onClick={() => handleResolve(req.id, 'MEDIUM')}>
                    Mark Normal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
