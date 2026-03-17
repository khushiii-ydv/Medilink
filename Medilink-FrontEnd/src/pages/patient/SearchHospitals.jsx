import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import MapView from '../../components/MapView';
import { BLOOD_TYPES, SPECIALTIES } from '../../data/mockData';
import { Search, MapPin, Bed, HeartPulse, Wind, Star, Filter, X, ChevronRight } from 'lucide-react';

export default function SearchHospitals() {
  const { hospitals } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    minBeds: '', minIcu: '', minVentilators: '', bloodType: '', specialty: '', minOxygen: '',
  });

  const filtered = hospitals.filter(h => {
    if (!h || !h.beds || !h.ventilators || !h.bloodBank || !h.specialists) return false;
    if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase()) && !h.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.minBeds && h.beds.available < parseInt(filters.minBeds)) return false;
    if (filters.minIcu && h.beds.icuAvailable < parseInt(filters.minIcu)) return false;
    if (filters.minVentilators && h.ventilators.available < parseInt(filters.minVentilators)) return false;
    if (filters.bloodType && (h.bloodBank[filters.bloodType] || 0) < 1) return false;
    if (filters.specialty && !h.specialists.some(s => s.specialty === filters.specialty && s.available)) return false;
    if (filters.minOxygen && h.oxygen.available < parseInt(filters.minOxygen)) return false;
    return true;
  });

  const mapMarkers = filtered.filter(h => h && h.lat && h.lng).map(h => ({
    id: h.id, lat: h.lat, lng: h.lng, type: 'hospital',
    popup: { title: h.name, subtitle: h.address, details: [
      { label: 'Beds', value: h.beds?.available ?? 'N/A' },
      { label: 'ICU', value: h.beds?.icuAvailable ?? 'N/A' },
    ] }
  }));

  const clearFilters = () => setFilters({ minBeds: '', minIcu: '', minVentilators: '', bloodType: '', specialty: '', minOxygen: '' });
  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Search Hospitals</h1>
        <p>Find hospitals based on available resources and specialties</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="form-input" style={{ paddingLeft: 42, width: '100%' }} placeholder="Search by hospital name or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} id="hospital-search-input" />
        </div>
        <button className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowFilters(!showFilters)} id="toggle-filters">
          <Filter size={16} /> Filters {hasFilters && `(${Object.values(filters).filter(v => v).length})`}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Filter Resources</h3>
            {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters}><X size={14} /> Clear All</button>}
          </div>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Min Available Beds</label>
              <input type="number" placeholder="Any" value={filters.minBeds} onChange={e => setFilters({...filters, minBeds: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Min ICU Beds</label>
              <input type="number" placeholder="Any" value={filters.minIcu} onChange={e => setFilters({...filters, minIcu: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Min Ventilators</label>
              <input type="number" placeholder="Any" value={filters.minVentilators} onChange={e => setFilters({...filters, minVentilators: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Blood Type Available</label>
              <select value={filters.bloodType} onChange={e => setFilters({...filters, bloodType: e.target.value})}>
                <option value="">Any</option>
                {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Specialist Available</label>
              <select value={filters.specialty} onChange={e => setFilters({...filters, specialty: e.target.value})}>
                <option value="">Any</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Oxygen (L)</label>
              <input type="number" placeholder="Any" value={filters.minOxygen} onChange={e => setFilters({...filters, minOxygen: e.target.value})} />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing <strong>{filtered.length}</strong> of {hospitals.length} hospitals
        </p>
        <div className="tabs" style={{ marginBottom: 0, width: 'auto' }}>
          <button className={`tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>Grid</button>
          <button className={`tab ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>Map</button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div style={{ marginBottom: 24 }}>
          <MapView markers={mapMarkers} center={[20.5937, 78.9629]} zoom={5} height="500px" />
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Search size={48} />
              <h3>No hospitals match your filters</h3>
              <p>Try adjusting your search criteria or clearing filters</p>
            </div>
          ) : filtered.map(h => (
            <Link key={h.id} to={`/patient/hospital/${h.id}`} className="hospital-search-card" id={`hospital-card-${h.id}`}>
              <img src={h.image} alt={h.name} className="hospital-card-image" loading="lazy" />
              <div className="hospital-card-body">
                <h3 className="hospital-card-name">{h.name}</h3>
                <p className="hospital-card-address"><MapPin size={14} /> {h.address}</p>
                <div className="hospital-card-stats">
                  <div className="hospital-card-stat">
                    <span className="hospital-card-stat-value">{h.beds.available}</span>
                    <span className="hospital-card-stat-label">Beds</span>
                  </div>
                  <div className="hospital-card-stat">
                    <span className="hospital-card-stat-value">{h.beds.icuAvailable}</span>
                    <span className="hospital-card-stat-label">ICU</span>
                  </div>
                  <div className="hospital-card-stat">
                    <span className="hospital-card-stat-value">{h.ventilators.available}</span>
                    <span className="hospital-card-stat-label">Ventilators</span>
                  </div>
                </div>
                <div className="hospital-card-footer">
                  <div className="hospital-card-rating">
                    <Star size={14} fill="var(--warning)" /> {h.rating}
                  </div>
                  <span className="badge badge-primary">{h.accreditation}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
