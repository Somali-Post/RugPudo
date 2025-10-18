import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from '@react-google-maps/api';
import { encode6D, decode6D } from '../utils/6d-address-utils';
import styles from './MapScreen.module.css';
import { MOCK_PUDO_DATA } from '../data/mockPudos';
import { useAppContext } from '../context/shared';

const containerStyle = { width: '100%', height: '100%' };
const mogadishuCenter = { lat: 2.0469, lng: 45.3182 };

const CustomInfoPanel = ({ pudo, mode, onSelect, onClose, distanceKm }) => (
  <div className={styles.infoPanel}>
    <div className={styles.infoHeader}>
      <h4 className={styles.infoTitle}>{pudo.name}</h4>
      <button className={styles.infoClose} onClick={onClose}>×</button>
    </div>
    <div className={styles.infoMeta}>
      <div><strong>6D Address:</strong> {encode6D(pudo.lat, pudo.lng)}</div>
      <div>{pudo.district}{typeof distanceKm === 'number' ? ` • ${distanceKm.toFixed(1)} km` : ''}</div>
      <div>Hours: {pudo.hours}</div>
    </div>
    {mode === 'onboarding' && (
      <div className={styles.infoAction}>
        <button className={styles.infoActionBtn} onClick={() => onSelect(pudo)}>Select as My PUDO</button>
      </div>
    )}
  </div>
);

const MapScreen = ({ mode = 'browse', onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const location = useLocation();
  const { showToast } = useAppContext();

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

  const toRad = (deg) => (deg * Math.PI) / 180;
  const distanceKm = (a, b) => {
    // Haversine for accuracy
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const filteredPudos = useMemo(() => {
    let results = MOCK_PUDO_DATA;
    if (!searchQuery) {
      // keep as is
    } else {
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
        results = closest ? [closest] : [];
      } else {
        const q = searchQuery.toLowerCase();
        results = MOCK_PUDO_DATA.filter(p => p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q));
      }
    }

    return results;
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
      {/* Near Me removed as requested */}
      <div className={styles.mapFabs}>
        <button className={styles.fab} title="My location" onClick={() => { if (userLocation && mapRef.current) { mapRef.current.panTo(userLocation); mapRef.current.setZoom(15); } }}>⌖</button>
        <button className={styles.fab} title="Fit results" onClick={() => { if (!mapRef.current || filteredPudos.length === 0) return; const bounds = new window.google.maps.LatLngBounds(); filteredPudos.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng })); mapRef.current.fitBounds(bounds, 60); }}>⤢</button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mogadishuCenter}
        zoom={14}
        onLoad={onLoad}
        onClick={() => setActiveMarker(null)}
        options={{ disableDefaultUI: true, zoomControl: true, styles: [
          { elementType: 'geometry', stylers: [{ saturation: -10 }, { lightness: 10 }] },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 20 }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6b7683' }] },
          { featureType: 'water', stylers: [{ color: '#9ec6d6' }] },
        ] }}
      >
        {filteredPudos.map(p => (
          <Marker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            onClick={() => setActiveMarker(p)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?><svg width="40" height="54" viewBox="0 0 40 54" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/></filter></defs><path filter="url(#s)" d="M20 53c8-13 18-19 18-33A18 18 0 1 0 2 20c0 14 10 20 18 33z" fill="#F39C12" stroke="white" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="white"/></svg>')}`,
              scaledSize: new window.google.maps.Size(34, 46),
              anchor: new window.google.maps.Point(17, 46),
            }}
          />
        ))}

        {/* Labels above pins */}
        {filteredPudos.map(p => (
          <OverlayView
            key={`lbl-${p.id}`}
            position={{ lat: p.lat, lng: p.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(w, h) => ({ x: -((w ?? 0) / 2), y: -(h ?? 0) - 58 })}
          >
            <div className={styles.pinLabel}>{p.name}</div>
          </OverlayView>
        ))}

        {userLocation && (
          <Marker
            position={userLocation}
            zIndex={999}
            icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#00BCD4', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 }}
          />
        )}

        {activeMarker && (
          <OverlayView
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({ x: -(width / 2), y: -(height + 40) })}
          >
            <CustomInfoPanel
              pudo={activeMarker}
              mode={mode}
              onSelect={onSelect}
              onClose={() => setActiveMarker(null)}
              distanceKm={userLocation ? distanceKm(userLocation, { lat: activeMarker.lat, lng: activeMarker.lng }) : undefined}
            />
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapScreen;


