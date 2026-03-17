import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const hospitalIcon = new L.DivIcon({
  html: '<div class="map-marker hospital-marker"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 21h18M9 8h6M12 5v6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg></div>',
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const ambulanceIcon = new L.DivIcon({
  html: '<div class="map-marker ambulance-marker"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10 10H6M8 8v4M22 12h-4l-3-8H3v14h2"/><circle cx="7" cy="18" r="2"/><path d="M15 18h-4"/><circle cx="17" cy="18" r="2"/><path d="M22 12v6h-2"/></svg></div>',
  className: 'custom-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function MapView({ markers = [], center = [20.5937, 78.9629], zoom = 5, height = '400px', type = 'hospital' }) {
  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, i) => (
          <Marker
            key={marker.id || i}
            position={[marker.lat, marker.lng]}
            icon={marker.type === 'ambulance' ? ambulanceIcon : hospitalIcon}
          >
            {marker.popup && (
              <Popup>
                <div className="map-popup">
                  <h4>{marker.popup.title}</h4>
                  {marker.popup.subtitle && <p>{marker.popup.subtitle}</p>}
                  {marker.popup.details && marker.popup.details.map((d, j) => (
                    <div key={j} className="popup-detail">
                      <span className="popup-label">{d.label}:</span>
                      <span className="popup-value">{d.value}</span>
                    </div>
                  ))}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
