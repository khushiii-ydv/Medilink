import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ClipboardList, Clock, Building2, AlertTriangle } from 'lucide-react';

export default function MyRequests() {
  const { user } = useAuth();
  const { getPatientRequests, hospitals } = useData();
  const requests = getPatientRequests(user.patientId);

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>My Requests</h1>
        <p>Track all your admission and ambulance requests</p>
      </div>

      <div className="request-list">
        {requests.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={48} />
            <h3>No requests yet</h3>
            <p>Your admission and ambulance requests will appear here</p>
          </div>
        ) : (
          requests.map(req => {
            const hospital = hospitals.find(h => h.id === req.toHospitalId);
            return (
              <div key={req.id} className="request-card">
                <div className="request-card-header">
                  <h3>{req.type === 'patient-admission' ? 'Admission Request' : 'Ambulance Request'}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>
                      <AlertTriangle size={10} /> {req.urgency}
                    </span>
                    <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
                <div className="request-meta">
                  {hospital && <span className="request-meta-item"><Building2 size={14} /> {hospital.name}</span>}
                  <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
                </div>
                {req.condition && <div className="request-condition">{req.condition}</div>}
                {req.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{req.notes}</p>}
                {req.responseNotes && (
                  <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-md)', fontSize: '0.85rem' }}>
                    <strong>Hospital Response:</strong> {req.responseNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
