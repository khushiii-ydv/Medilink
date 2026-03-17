import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Users, Clock, CheckCircle, XCircle, AlertTriangle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientRequests() {
  const { user } = useAuth();
  const { getHospitalRequests, updateRequestStatus } = useData();
  const requests = getHospitalRequests(user.hospitalId).filter(r => r.type === 'patient-admission');

  const [transferReasons, setTransferReasons] = useState({});

  const handleRespond = (reqId, status) => {
    if (!transferReasons[reqId] || transferReasons[reqId].trim() === '') {
      toast.error('Reason for Patient Transfer is required.');
      return;
    }
    updateRequestStatus(reqId, status);
    toast.success(`Request ${status}`);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Patient Requests</h1>
        <p>Manage incoming patient admission and appointment requests</p>
      </div>

      <div className="request-list">
        {requests.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No patient requests</h3>
            <p>Patient admission requests will appear here</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="request-card">
              <div className="request-card-header">
                <h3>Patient Admission Request</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>
                    <AlertTriangle size={10} /> {req.urgency}
                  </span>
                  <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
                </div>
              </div>
              <div className="request-meta">
                <span className="request-meta-item"><Users size={14} /> {req.from?.name}</span>
                <span className="request-meta-item"><Phone size={14} /> {req.from?.phone}</span>
                <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
              </div>
              {req.condition && <div className="request-condition">{req.condition}</div>}
              {req.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>{req.notes}</p>}
              {req.status === 'pending' && (
                <div style={{ marginTop: 12 }}>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>
                      Reason for Patient Transfer <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Document why a patient transfer is being made..." 
                      value={transferReasons[req.id] || ''} 
                      onChange={e => setTransferReasons(prev => ({ ...prev, [req.id]: e.target.value }))}
                    />
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-accent btn-sm" onClick={() => handleRespond(req.id, 'accepted')}><CheckCircle size={14} /> Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRespond(req.id, 'rejected')}><XCircle size={14} /> Reject</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
