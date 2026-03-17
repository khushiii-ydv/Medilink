import { useState, useEffect } from 'react';
import { getAllHospitals, getPatientRequests, getSystemDoctors, assignRequestToDoctor } from '../../api/adminApi';
import StatCard from '../../components/StatCard';
import { Building2, Ambulance, AlertOctagon, AlertTriangle, Users, RefreshCw, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hosps, reqs, docs] = await Promise.all([
        getAllHospitals(),
        getPatientRequests(),
        getSystemDoctors()
      ]);
      setHospitals(hosps);
      setRequests(reqs);
      setDoctors(docs);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (requestId, doctorId) => {
    try {
      await assignRequestToDoctor(requestId, doctorId);
      toast.success('Doctor assigned to case');
      setAssigningId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to assign doctor');
    }
  };

  if (loading) return (
    <div className="empty-state">
      <RefreshCw size={40} className="spin" style={{ color: 'var(--primary-500)' }} />
      <p>Loading platform overview...</p>
    </div>
  );

  const activeCases = requests.filter(r => r.status === 'PENDING' || r.status === 'ASSIGNED');
  const criticalCases = activeCases.filter(r => r.priority === 'CRITICAL');
  
  const totalBeds = hospitals.reduce((acc, h) => acc + (h.resources?.totalBeds || 0), 0);
  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + (h.resources?.availableBeds || 0), 0);

  return (
    <div>
      <div className="dashboard-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Admin Overview</h1>
            <p>Platform-wide monitoring and conflict resolution</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-overview-grid">
        <StatCard icon={Building2} label="Network Hospitals" value={hospitals.length} color="primary" />
        <StatCard icon={Users} label="System Doctors" value={doctors.length} color="info" />
        <StatCard icon={AlertTriangle} label="Active Requests" value={activeCases.length} color="warning" />
        <StatCard icon={AlertOctagon} label="Critical Cases" value={criticalCases.length} color="danger" />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2><AlertCircle size={20} /> Unresolved Conflicts</h2>
          <span className="badge badge-warning">{requests.filter(r => r.status === 'PENDING').length} Pending</span>
        </div>

        <div className="request-list">
          {requests.filter(r => r.status !== 'COMPLETED').map(req => (
            <div key={req.id} className="request-card" style={{ background: 'var(--bg-secondary)' }}>
              <div className="request-card-header">
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{req.patientName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{req.type} • {req.hospital?.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${req.priority === 'CRITICAL' ? 'danger' : req.priority === 'HIGH' ? 'warning' : 'info'}`}>
                    {req.priority}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    Status: {req.status}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Condition:</strong> {req.condition}
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {req.assignedDoctor ? (
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                       Assigned to: {req.assignedDoctor.name}
                    </span>
                  ) : 'Not Assigned'}
                </div>
                
                {assigningId === req.id ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select 
                      className="form-input" 
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', marginBottom: 0 }}
                      onChange={(e) => handleAssign(req.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Doctor...</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAssigningId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn btn-accent btn-sm" onClick={() => setAssigningId(req.id)}>
                    <UserPlus size={14} /> {req.assignedDoctor ? 'Reassign' : 'Assign Doctor'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-section mt-8">
        <h2>Hospital Capacity Summary</h2>
        <div className="card mt-4" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Overall Bed Availability</span>
            <span>{totalAvailableBeds} / {totalBeds} Available ({Math.round((totalAvailableBeds/Math.max(1,totalBeds))*100)}%)</span>
          </div>
          <div style={{ width: '100%', height: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(totalAvailableBeds/Math.max(1,totalBeds))*100}%`, backgroundColor: 'var(--primary-500)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
