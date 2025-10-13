import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { encode6D, decode6D } from '../utils/6d-address-utils';
import styles from './MapScreen.module.css';

const MOCK_PUDO_DATA = [
  { id: '1', name: 'Somali Postal Service', district: 'Boondheere', lat: 2.04027, lng: 45.34715 },
  { id: '2', name: 'Hayat Market Boondheere', district: 'Boondheere', lat: 2.04162, lng: 45.34816 },
  { id: '3', name: 'Hayat Market (KM5 Zope)', district: 'Hodan', lat: 2.03084, lng: 45.30356 },
  { id: '4', name: 'Hayat Market (KM4 Taleex)', district: 'Waaberi', lat: 2.03209, lng: 45.31291 },
];

const containerStyle = { width: '100%', height: '100%' };
const mogadishuCenter = { lat: 2.0469, lng: 45.3182 };

const MapScreen = ({ mode = "browse", onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // Effect to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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

  // Effect to pan map when a 6D search is successful
  useEffect(() => {
    if (filteredPudos.length === 1 && /^\d{2}-\d{2}-\d{2}$/.test(searchQuery)) {
      const singlePudo = filteredPudos[0];
      if (mapRef.current) {
        mapRef.current.panTo({ lat: singlePudo.lat, lng: singlePudo.lng });
        mapRef.current.setZoom(17);
      }
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
        onLoad={(map) => { mapRef.current = map; }}
        options={{
          disableDefaultUI: true, // Hides default controls
          zoomControl: true,      // Re-enables zoom control
        }}
      >
        {/* PUDO Markers */}
        {filteredPudos.map(pudo => (
          <Marker
            key={pudo.id}
            position={{ lat: pudo.lat, lng: pudo.lng }}
            onClick={() => setActiveMarker(pudo)}
          />
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            }}
          />
        )}

        {/* Info Window for Active PUDO */}
        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div>
              <h4>{activeMarker.name}</h4>
              <p><strong>6D Address:</strong> {encode6D(activeMarker.lat, activeMarker.lng)}</p>
              <p>{activeMarker.district}</p>
              {mode === 'onboarding' && (
                <button 
                  style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#F39C12', color: 'white', cursor: 'pointer' }}
                  onClick={() => onSelect(activeMarker)}
                >
                  Select as My PUDO
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapScreen;