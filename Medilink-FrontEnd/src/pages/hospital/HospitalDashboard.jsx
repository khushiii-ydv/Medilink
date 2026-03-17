/**
 * HospitalDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart data loading:
 *   1. Tries to fetch from backend API (real PostgreSQL data)
 *   2. If API is unavailable / DB not set up → falls back to mock data silently
 *   3. Shows a "Demo Mode" badge when using fallback data
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import MapView from '../../components/MapView';
import {
  Bed, HeartPulse, Wind, Droplets, Ambulance,
  Users, Clock, AlertTriangle, Building2, RefreshCw, Wifi, WifiOff,
} from 'lucide-react';
import { getHospitalById, getAllHospitals } from '../../api/hospitalApi';

export default function HospitalDashboard() {
  const { user } = useAuth();
  // DataContext still provides mock ambulances/requests and fallback hospital data
  const {
    getHospital: getMockHospital,
    hospitals: mockHospitals,
    getAmbulancesByHospital,
    getHospitalRequests,
  } = useData();

  const [hospital, setHospital] = useState(null);
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const ambulances = getAmbulancesByHospital(user.hospitalId);
  const requests = getHospitalRequests(user.hospitalId);
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const fetchData = async () => {
    setLoading(true);
    try {
      // ── Try live API first ─────────────────────────────────────────────────
      const [hosp, hosps] = await Promise.all([
        getHospitalById(user.hospitalId),
        getAllHospitals(),
      ]);
      setHospital(hosp);
      setAllHospitals(hosps);
      setIsLiveData(true);
    } catch {
      // ── Fallback: use mock data so the dashboard still works ───────────────
      const mockHosp = getMockHospital(user.hospitalId);
      setHospital(mockHosp || null);
      setAllHospitals(mockHospitals.filter(Boolean));
      setIsLiveData(false);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => { fetchData(); }, [user.hospitalId]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
        <h3 style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading dashboard…</h3>
      </div>
    );
  }

  // ── Hospital not found even in mock data ──────────────────────────────────
  if (!hospital) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <AlertTriangle size={40} style={{ color: 'var(--danger)' }} />
        <h3 style={{ marginTop: 12, color: 'var(--danger)' }}>Hospital not found</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Could not find hospital with ID: <code>{user.hospitalId}</code>
        </p>
        <button className="btn btn-primary" onClick={fetchData}>Retry</button>
      </div>
    );
  }

  // ── Nearby hospitals (filter out self) ────────────────────────────────────
  const nearbyHospitals = allHospitals
    .filter(h => h && h.id !== hospital.id && h.beds && h.ventilators)
    .slice(0, 9);

  const mapMarkers = allHospitals
    .filter(h => h && h.lat && h.lng && h.beds && h.ventilators)
    .map(h => ({
      id: h.id, lat: h.lat, lng: h.lng, type: 'hospital',
      popup: {
        title: h.name, subtitle: h.address,
        details: [
          { label: 'Beds Available', value: h.beds?.available ?? 'N/A' },
          { label: 'ICU Available', value: h.beds?.icuAvailable ?? 'N/A' },
          { label: 'Ventilators', value: h.ventilators?.available ?? 'N/A' },
        ],
      },
    }));

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="dashboard-page-header" style={{ paddingBottom: 8 }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, var(--primary-500, #3b82f6) 0%, #6366f1 100%)',
          borderRadius: 14, padding: '10px 28px', marginBottom: 12,
          boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
        }}>
          <h1 style={{
            fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}>
            🏥 {hospital.name}
          </h1>
        </div>

        {/* Data source badge + refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4 }}>
            Here's your hospital overview for today
          </p>
          {/* Live vs Demo badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
            background: isLiveData ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
            color: isLiveData ? '#22c55e' : '#eab308',
            border: `1px solid ${isLiveData ? '#22c55e44' : '#eab30844'}`,
          }}>
            {isLiveData ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isLiveData ? 'Live Data' : 'Demo Mode'}
          </span>
          {lastRefreshed && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
              Updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={fetchData} title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Demo mode notice */}
        {!isLiveData && (
          <div style={{
            marginTop: 8, padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem',
            background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
            color: 'var(--text-secondary)',
          }}>
            ⚠️ <strong>Demo Mode:</strong> Backend API unavailable — showing sample data. Run{' '}
            <code>npm run dev</code> in <code>Medilink-Backend/</code> and make sure PostgreSQL is running.
          </div>
        )}
      </div>

      {/* ── Resource stat cards row 1 ─────────────────────────────────────── */}
      <div className="dashboard-overview-grid">
        <StatCard icon={Bed} label="Beds Available" value={hospital.beds?.available ?? 0} total={hospital.beds?.total ?? 0} color="primary" />
        <StatCard icon={HeartPulse} label="ICU Beds" value={hospital.beds?.icuAvailable ?? 0} total={hospital.beds?.icu ?? 0} color="danger" />
        <StatCard icon={Wind} label="Ventilators" value={hospital.ventilators?.available ?? 0} total={hospital.ventilators?.total ?? 0} color="warning" />
        <StatCard icon={Droplets} label="Oxygen Supply" value={hospital.oxygen?.available ?? 0} total={hospital.oxygen?.capacity ?? 0} color="info" suffix="L" />
      </div>

      {/* ── Resource stat cards row 2 ─────────────────────────────────────── */}
      <div className="dashboard-overview-grid">
        <StatCard icon={Ambulance} label="Ambulances" value={ambulances.filter(a => a.status === 'available').length} total={ambulances.length} color="danger" />
        <StatCard icon={Users} label="Specialists Online" value={hospital.specialists?.filter(s => s.available).length ?? 0} total={hospital.specialists?.length ?? 0} color="success" />
        <StatCard icon={AlertTriangle} label="Pending Requests" value={pendingRequests.length} color="warning" />
        <StatCard icon={Clock} label="Accreditation" value={hospital.accreditation ?? '—'} color="primary" />
      </div>

      {/* ── Pending Requests ──────────────────────────────────────────────── */}
      {pendingRequests.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Pending Requests ({pendingRequests.length})</h2>
          </div>
          <div className="request-list">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="request-card">
                <div className="request-card-header">
                  <h3>
                    {req.type === 'patient-admission' ? 'Patient Admission'
                      : req.type === 'hospital-transfer' ? 'Hospital Transfer'
                      : req.type === 'blood-request' ? 'Blood Request'
                      : 'Ambulance Request'}
                  </h3>
                  <span className={`badge badge-${req.urgency === 'critical' ? 'danger' : req.urgency === 'high' ? 'warning' : 'info'}`}>
                    {req.urgency}
                  </span>
                </div>
                <div className="request-meta">
                  <span className="request-meta-item"><Users size={14} /> {req.from?.name}</span>
                  <span className="request-meta-item"><Clock size={14} /> {new Date(req.createdAt).toLocaleString()}</span>
                </div>
                {req.condition && <div className="request-condition">{req.condition}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Nearby Hospitals ──────────────────────────────────────────────── */}
      {nearbyHospitals.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2><Building2 size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />Nearby Hospitals</h2>
            <span className="badge badge-info">{nearbyHospitals.length} hospitals in network</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {nearbyHospitals.map(h => (
              <div key={h.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div className="stat-card-icon stat-icon-primary" style={{ width: 36, height: 36, flexShrink: 0 }}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{h.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{h.accreditation}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { icon: HeartPulse, label: 'ICU Beds',     value: h.beds?.icuAvailable ?? 'N/A', color: 'danger' },
                    { icon: Bed,        label: 'Gen. Beds',    value: h.beds?.available ?? 'N/A',    color: 'primary' },
                    { icon: Wind,       label: 'Ventilators',  value: h.ventilators?.available ?? 'N/A', color: 'warning' },
                    { icon: Droplets,   label: 'Oxygen (L)',   value: h.oxygen?.available ?? 'N/A',  color: 'info' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'var(--bg-tertiary)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <item.icon size={14} style={{ color: `var(--${item.color === 'primary' ? 'primary-500' : item.color})` }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Map ───────────────────────────────────────────────────────────── */}
      <div className="dashboard-section">
        <div className="dashboard-section-header"><h2>Hospital Network Map</h2></div>
        <MapView
          markers={mapMarkers}
          center={[hospital.lat ?? 20.5937, hospital.lng ?? 78.9629]}
          zoom={6}
          height="400px"
        />
      </div>
    </div>
  );
}
