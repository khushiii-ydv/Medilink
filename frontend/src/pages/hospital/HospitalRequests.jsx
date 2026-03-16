import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Send, Building2, Clock, Users, CheckCircle, XCircle, AlertTriangle, Droplets, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HospitalRequests() {
  const { user } = useAuth();
  const { hospitals, getHospitalRequests, createRequest, updateRequestStatus } = useData();
  const [activeTab, setActiveTab] = useState('incoming');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newReq, setNewReq] = useState({ toHospitalId: '', type: 'hospital-transfer', condition: '', facility: '', bloodType: '', units: '', notes: '' });

  const allRequests = getHospitalRequests(user.hospitalId);
  const incomingRequests = allRequests.filter(r => r.type === 'hospital-transfer' || r.type === 'blood-request' || r.type === 'equipment-request');
  
  const outgoingRequests = [];
  // Find requests sent BY this hospital
  hospitals.forEach(h => {
    if (h.id !== user.hospitalId) {
      const reqs = getHospitalRequests(h.id);
      reqs.forEach(r => {
        if (r.from?.hospitalId === user.hospitalId) outgoingRequests.push(r);
      });
    }
  });

  const hospital = hospitals.find(h => h.id === user.hospitalId);

  const handleSendRequest = () => {
    if (!newReq.toHospitalId) { toast.error('Select a hospital'); return; }
    createRequest({
      type: newReq.type,
      from: { type: 'hospital', hospitalId: user.hospitalId, name: hospital?.name },
      toHospitalId: newReq.toHospitalId,
      urgency: 'high',
      condition: newReq.condition,
      facility: newReq.facility,
      bloodType: newReq.bloodType,
      units: parseInt(newReq.units) || 0,
      notes: newReq.notes,
    });
    toast.success('Request sent successfully!');
    setShowNewRequest(false);
    setNewReq({ toHospitalId: '', type: 'hospital-transfer', condition: '', facility: '', bloodType: '', units: '', notes: '' });
  };

  const handleRespond = (reqId, status) => {
    updateRequestStatus(reqId, status);
    toast.success(`Request ${status}`);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'hospital-transfer': return <HeartPulse size={16} />;
      case 'blood-request': return <Droplets size={16} />;
      default: return <Building2 size={16} />;
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Hospital Requests</h1>
        <p>Manage inter-hospital transfer, blood, and equipment requests</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="tabs" style={{ flex: 1, maxWidth: 400 }}>
          <button className={`tab ${activeTab === 'incoming' ? 'active' : ''}`} onClick={() => setActiveTab('incoming')}>Incoming ({incomingRequests.length})</button>
          <button className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`} onClick={() => setActiveTab('outgoing')}>Outgoing ({outgoingRequests.length})</button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewRequest(!showNewRequest)}>
          <Send size={16} /> New Request
        </button>
      </div>

      {showNewRequest && (
        <div className="card" style={{ marginBottom: 24, padding: 28 }}>
          <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Send Request to Another Hospital</h3>
          <div className="request-form-grid">
            <div className="form-group">
              <label className="form-label">Request Type</label>
              <select className="form-select" value={newReq.type} onChange={e => setNewReq({...newReq, type: e.target.value})}>
                <option value="hospital-transfer">Patient Transfer</option>
                <option value="blood-request">Blood Request</option>
                <option value="equipment-request">Equipment Request</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Hospital</label>
              <select className="form-select" value={newReq.toHospitalId} onChange={e => setNewReq({...newReq, toHospitalId: e.target.value})}>
                <option value="">Select hospital</option>
                {hospitals.filter(h => h.id !== user.hospitalId).map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            {newReq.type === 'blood-request' && (
              <>
                <div className="form-group">
                  <label className="form-label">Blood Type</label>
                  <select className="form-select" value={newReq.bloodType} onChange={e => setNewReq({...newReq, bloodType: e.target.value})}>
                    <option value="">Select type</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Units Required</label>
                  <input className="form-input" type="number" placeholder="Units" value={newReq.units} onChange={e => setNewReq({...newReq, units: e.target.value})} />
                </div>
              </>
            )}
            <div className="form-group full-width">
              <label className="form-label">Patient Condition / Details</label>
              <textarea className="form-textarea" placeholder="Describe the patient condition or request details" value={newReq.condition} onChange={e => setNewReq({...newReq, condition: e.target.value})} />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Additional Notes</label>
              <input className="form-input" placeholder="Any additional notes" value={newReq.notes} onChange={e => setNewReq({...newReq, notes: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleSendRequest}><Send size={14} /> Send Request</button>
            <button className="btn btn-ghost" onClick={() => setShowNewRequest(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="request-list">
        {(activeTab === 'incoming' ? incomingRequests : outgoingRequests).length === 0 ? (
          <div className="empty-state">
            <Send size={48} />
            <h3>No {activeTab} requests</h3>
            <p>{activeTab === 'incoming' ? 'No requests from other hospitals yet' : 'You haven\'t sent any requests yet'}</p>
          </div>
        ) : (
          (activeTab === 'incoming' ? incomingRequests : outgoingRequests).map(req => (
            <div key={req.id} className="request-card">
              <div className="request-card-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getTypeIcon(req.type)}
                  {req.type === 'hospital-transfer' ? 'Patient Transfer' : req.type === 'blood-request' ? 'Blood Request' : 'Equipment Request'}
                </h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>{req.urgency}</span>
                  <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}`}>{req.status}</span>
                </div>
              </div>
              <div className="request-meta">
                <span className="request-meta-item"><Building2 size={14} /> From: {req.from?.name}</span>
                <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
                {req.bloodType && <span className="request-meta-item"><Droplets size={14} /> {req.bloodType} ({req.units} units)</span>}
              </div>
              {req.condition && <div className="request-condition">{req.condition}</div>}
              {activeTab === 'incoming' && req.status === 'pending' && (
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
