import React, { useState, useMemo } from 'react';
import { IconMenu, IconFilter, IconUser, IconSearch, IconClock, IconStar, IconMap } from '../components/icons';
import BottomSheet from '../components/BottomSheet'; // Import the new component
import styles from '../components/BottomSheet.module.css'; // Import styles for content

const MOCK_PUDO_DATA = [
  { id: '1', name: 'Fiqi Supermarket', status: 'Open', addressCode: '0.-43-61', district: 'Yaaqshiid', hours: 'Open 24 hours', distance: '0.8', rating: 4.6, reviewCount: 31, phone: '+252 61 4675555' },
  { id: '2', name: 'Juba Hypermarket', status: 'Open', addressCode: '0.-43-22', district: 'Gufta', hours: 'Opens 8 AM', distance: '1.2', rating: 4.7, reviewCount: 15, phone: '+252 61 1234567' },
  { id: '3', name: 'Hodan Global', status: 'Closed', addressCode: '1.-12-89', district: 'Hodan', hours: 'Opens 9 AM', distance: '2.5', rating: 4.2, reviewCount: 45, phone: '+252 61 7654321' },
];

export default function PudoListScreen({ mode = "browse", onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPudo, setSelectedPudo] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');

  const filteredData = useMemo(() =>
    MOCK_PUDO_DATA.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addressCode.includes(searchQuery)
    ), [searchQuery]);

  const handleCardPress = (pudo) => {
    setSelectedPudo(pudo);
    setActiveTab('Details');
  };

  const handleSelectPudo = (pudo) => {
    console.log("Selected PUDO:", pudo.name);
    setSelectedPudo(null);
    onSelect?.(pudo);
  };

  return (
    <>
      <header className="app-header">
        <button className="icon-btn" aria-label="Menu"><IconMenu /></button>
        <h1>PUDO Points</h1>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Filter"><IconFilter /></button>
          <button className="icon-btn" aria-label="Account"><IconUser /></button>
        </div>
      </header>

      <div className="search-wrap">
        <div className="search-input">
          <IconSearch />
          <input
            type="search"
            placeholder="Search by name, location or 6d add..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <main className="content">
        <div className="pudo-list">
          {filteredData.map(item => (
            <div key={item.id} className="pudo-card" onClick={() => handleCardPress(item)}>
              <div className="row-top">
                <span className="title">{item.name}</span>
                <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <span className="meta">{item.addressCode} - {item.district}</span>
              <div className="row-hours">
                <span className="row-rating"><IconClock className="icon" /> {item.hours}</span>
                <span className="distance">{item.distance} km</span>
              </div>
              <span className="row-rating"><IconStar className="icon" /> {item.rating} ({item.reviewCount} reviews)</span>
            </div>
          ))}
        </div>
      </main>

      <BottomSheet isOpen={!!selectedPudo} onClose={() => setSelectedPudo(null)}>
        {selectedPudo && (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>{selectedPudo.name}</h2>
              <button className={styles.closeButton} onClick={() => setSelectedPudo(null)}>×</button>
            </header>
            <p className={styles.metaInfo}>{selectedPudo.addressCode} - {selectedPudo.district}</p>

            <div className={styles.tabSelector}>
              <button className={`${styles.tab} ${activeTab === 'Details' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Details')}>Details</button>
              <button className={`${styles.tab} ${activeTab === 'Photos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Photos')}>Photos</button>
            </div>

            {activeTab === 'Details' && (
              <div className={styles.detailsSection}>
                <div className={styles.detailItem}><IconClock className="icon" /> <span>{selectedPudo.hours}</span></div>
                <div className={styles.detailItem}><IconUser className="icon" /> <span>{selectedPudo.phone}</span></div>
                <div className={styles.detailItem}><IconStar className="icon" /> <span>{selectedPudo.rating} ({selectedPudo.reviewCount} reviews)</span></div>
              </div>
            )}
            {activeTab === 'Photos' && <p>Photo gallery will be here.</p>}

            <div className={styles.actionButtons}>
              <button className={`${styles.actionButton} ${styles.secondary}`}><IconMap className="icon" /> View on Map</button>
              <button className={`${styles.actionButton} ${styles.primary}`} onClick={() => handleSelectPudo(selectedPudo)}>Select as My PUDO</button>
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}
