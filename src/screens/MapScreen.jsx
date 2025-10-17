import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from '@react-google-maps/api';
import { encode6D, decode6D } from '../utils/6d-address-utils';
import styles from './MapScreen.module.css';
import { MOCK_PUDO_DATA } from '../data/mockPudos';

const containerStyle = { width: '100%', height: '100%' };
const mogadishuCenter = { lat: 2.0469, lng: 45.3182 };

const CustomInfoPanel = ({ pudo, mode, onSelect, onClose }) => (
  <div className="glass-panel" style={{ width: '240px', position: 'relative' }}>
    <button onClick={onClose} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>×</button>
    <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.2rem' }}>{pudo.name}</h4>
    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>6D Address:</strong> {encode6D(pudo.lat, pudo.lng)}</p>
    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>{pudo.district}</p>
    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>Hours: {pudo.hours}</p>
    {mode === 'onboarding' && (
      <button className="btn-cta" style={{ width: '100%', marginTop: '12px' }} onClick={() => onSelect(pudo)}>
        Select as My PUDO
      </button>
    )}
  </div>
);

const MapScreen = ({ mode = 'browse', onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(newLocation);
          map.panTo(newLocation);
          map.setZoom(15);
        },
        () => console.log('Error: The Geolocation service failed.'),
      );
    }
  }, []);

  const filteredPudos = useMemo(() => {
    if (!searchQuery) return MOCK_PUDO_DATA;
    const is6dCode = /^\d{2}-\d{2}-\d{2}$/.test(searchQuery);
    if (is6dCode) {
      const decoded = decode6D(searchQuery);
      if (!decoded) return [];
      let closest = null;
      let min = Infinity;
      for (const p of MOCK_PUDO_DATA) {
        const d = Math.hypot(p.lat - decoded.lat, p.lng - decoded.lng);
        if (d < min) { min = d; closest = p; }
      }
      return closest ? [closest] : [];
    }
    const q = searchQuery.toLowerCase();
    return MOCK_PUDO_DATA.filter(p => p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
  }, [searchQuery]);

  useEffect(() => {
    if (filteredPudos.length === 1 && /^\d{2}-\d{2}-\d{2}$/.test(searchQuery) && mapRef.current) {
      const p = filteredPudos[0];
      mapRef.current.panTo({ lat: p.lat, lng: p.lng });
      mapRef.current.setZoom(17);
      setActiveMarker(p);
    }
  }, [filteredPudos, searchQuery]);

  // Handle focus query (?focus=<id>) to open a specific marker
  useEffect(() => {
    if (!mapRef.current) return;
    const params = new URLSearchParams(location.search);
    const focusId = params.get('focus');
    if (!focusId) return;
    const target = MOCK_PUDO_DATA.find(p => String(p.id) === String(focusId));
    if (!target) return;
    mapRef.current.panTo({ lat: target.lat, lng: target.lng });
    mapRef.current.setZoom(17);
    setActiveMarker(target);
  }, [location.search]);

  if (!isLoaded) return <div className="loading-map">Loading Map...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by name, district, or 6D code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mogadishuCenter}
        zoom={14}
        onLoad={onLoad}
        onClick={() => setActiveMarker(null)}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {filteredPudos.map(p => (
          <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }} onClick={() => setActiveMarker(p)} />
        ))}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#4285F4', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 }}
          />
        )}

        {activeMarker && (
          <OverlayView
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({ x: -(width / 2), y: -(height + 40) })}
          >
            <CustomInfoPanel pudo={activeMarker} mode={mode} onSelect={onSelect} onClose={() => setActiveMarker(null)} />
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapScreen;

