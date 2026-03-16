import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Clock, Users, CheckCircle, XCircle, AlertTriangle, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AmbulanceRequests() {
  const { user } = useAuth();
  const { getAmbulanceRequests, updateRequestStatus } = useData();
  const requests = getAmbulanceRequests(user.ambulanceId);

  const handleRespond = (reqId, status) => {
    updateRequestStatus(reqId, status);
    toast.success(`Request ${status}`);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Emergency Requests</h1>
        <p>View and respond to incoming emergency pickup requests</p>
      </div>
      <div className="request-list">
        {requests.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} />
            <h3>No emergency requests</h3>
            <p>Emergency pickup requests will appear here</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="request-card">
              <div className="request-card-header">
                <h3>Emergency Pickup</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>{req.urgency}</span>
                  <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
                </div>
              </div>
              <div className="request-meta">
                <span className="request-meta-item"><Users size={14} /> {req.from?.name}</span>
                {req.from?.phone && <span className="request-meta-item"><Phone size={14} /> {req.from?.phone}</span>}
                {req.pickupLocation && <span className="request-meta-item"><MapPin size={14} /> {req.pickupLocation}</span>}
                <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
              </div>
              {req.condition && <div className="request-condition">{req.condition}</div>}
              {req.status === 'pending' && (
                <div className="request-actions">
                  <button className="btn btn-accent btn-sm" onClick={() => handleRespond(req.id, 'accepted')}><CheckCircle size={14} /> Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRespond(req.id, 'rejected')}><XCircle size={14} /> Reject</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
