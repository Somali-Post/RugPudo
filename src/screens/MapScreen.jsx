import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, OverlayView } from '@react-google-maps/api';
import { encode6D, decode6D } from '../utils/6d-address-utils';
import styles from './MapScreen.module.css';
import { MOCK_PUDO_DATA } from '../data/mockPudos';

const containerStyle = { width: '100%', height: '100%' };
const mogadishuCenter = { lat: 2.0469, lng: 45.3182 };

// Custom Info Panel Component
const CustomInfoPanel = ({ pudo, mode, onSelect, onClose }) => {
  return (
    <div className="glass-panel" style={{ width: '240px' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>×</button>
      <h4 style={{ marginTop: 0, marginBottom: '8px' }}>{pudo.name}</h4>
      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>6D Address:</strong> {encode6D(pudo.lat, pudo.lng)}</p>
      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>{pudo.district}</p>
      <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>Rating: {pudo.rating} ({pudo.reviewCount} reviews)</p>
      
      {mode === 'onboarding' && (
        <button 
          style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#F39C12', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => onSelect(pudo)}
        >
          Select as My PUDO
        </button>
      )}
    </div>
  );
};

const MapScreen = ({ mode = "browse", onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
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
        () => console.log("Error: The Geolocation service failed.")
      );
    }
  }, []);

  const filteredPudos = useMemo(() => {
    if (!searchQuery) return MOCK_PUDO_DATA;
    const is6dCode = /^\d{2}-\d{2}-\d{2}$/.test(searchQuery);
    if (is6dCode) {
      const decodedCoord = decode6D(searchQuery);
      if (!decodedCoord) return [];
      let closestPudo = null;
      let minDistance = Infinity;
      MOCK_PUDO_DATA.forEach(pudo => {
        const dist = Math.sqrt(Math.pow(pudo.lat - decodedCoord.lat, 2) + Math.pow(pudo.lng - decodedCoord.lng, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestPudo = pudo;
        }
      });
      return closestPudo ? [closestPudo] : [];
    } else {
      return MOCK_PUDO_DATA.filter(pudo =>
        pudo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pudo.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [searchQuery]);

  useEffect(() => {
    if (filteredPudos.length === 1 && /^\d{2}-\d{2}-\d{2}$/.test(searchQuery) && mapRef.current) {
      const singlePudo = filteredPudos[0];
      mapRef.current.panTo({ lat: singlePudo.lat, lng: singlePudo.lng });
      mapRef.current.setZoom(17);
      setActiveMarker(singlePudo);
    }
  }, [filteredPudos, searchQuery]);

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
        onClick={() => setActiveMarker(null)} // Close panel when clicking map
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {filteredPudos.map(pudo => (
          <Marker
            key={pudo.id}
            position={{ lat: pudo.lat, lng: pudo.lng }}
            onClick={() => setActiveMarker(pudo)}
          />
        ))}

        {userLocation && (
          <Marker position={userLocation} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: "#4285F4", fillOpacity: 1, strokeColor: "white", strokeWeight: 2 }} />
        )}

        {activeMarker && (
          <OverlayView
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height + 40), // Position it above the marker
            })}
          >
            <CustomInfoPanel
              pudo={activeMarker}
              mode={mode}
              onSelect={onSelect}
              onClose={() => setActiveMarker(null)}
            />
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapScreen;
