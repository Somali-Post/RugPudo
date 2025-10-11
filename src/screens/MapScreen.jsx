import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { encode6D, decode6D } from '../utils/6d-address-utils';
import styles from './MapScreen.module.css';

const MOCK_PUDO_DATA = [
  { id: '1', name: 'Fiqi Supermarket', district: 'Yaaqshiid', lat: 2.0635, lng: 45.3328 },
  { id: '2', name: 'Juba Hypermarket', district: 'Gufta', lat: 2.0432, lng: 45.3125 },
  { id: '3', name: 'Hodan Global', district: 'Hodan', lat: 2.0371, lng: 45.3059 },
];

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Center of Mogadishu
const center = {
  lat: 2.0469,
  lng: 45.3182
};

const MapScreen = ({ mode = "browse", onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real app, you might pan the map here if it's a 6D code
  };

  const filteredPudos = useMemo(() => {
    if (!searchQuery) return MOCK_PUDO_DATA;
    
    const is6dCode = /^\d{2}-\d{2}-\d{2}$/.test(searchQuery);

    if (is6dCode) {
      const decodedCoord = decode6D(searchQuery);
      if (!decodedCoord) return [];

      // Find the closest PUDO to the decoded coordinate
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
      // Standard text search
      return MOCK_PUDO_DATA.filter(pudo =>
        pudo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pudo.district.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [searchQuery]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by name, district, or 6D code (e.g., 04-31-25)"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {filteredPudos.map(pudo => (
          <Marker
            key={pudo.id}
            position={{ lat: pudo.lat, lng: pudo.lng }}
            onClick={() => setActiveMarker(pudo)}
          />
        ))}

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