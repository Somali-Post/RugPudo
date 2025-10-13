import React, { useState, useMemo } from 'react';
import { IconMenu, IconFilter, IconUser, IconSearch, IconClock, IconStar, IconMap } from '../components/icons';
import BottomSheet from '../components/BottomSheet'; // Import the new component
import styles from '../components/BottomSheet.module.css'; // Import styles for content
import { useToast } from '../context/ToastContext';
import { MOCK_PUDO_DATA } from '../data/mockPudos';
import { encode6D } from '../utils/6d-address-utils';

export default function PudoListScreen({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPudo, setSelectedPudo] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const { showToast } = useToast();

  const filteredData = useMemo(() =>
    MOCK_PUDO_DATA.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  const handleCardPress = (pudo) => {
    setSelectedPudo(pudo);
    setActiveTab('Details');
  };

  const handleSelectPudo = (pudo) => {
    setSelectedPudo(null); // Close the bottom sheet
    showToast(
      "Great, You are now Registered!",
      `Your PUDO point is now set to ${pudo.name}`
    );
    // Wait for the toast to be visible before navigating
    setTimeout(() => {
      onSelect?.(pudo);
    }, 1500);
  };

  return (
    <>
      <header className="app-header">
        <button className="icon-btn" aria-label="Menu"><IconMenu /></button>
        <h1>PUDO Points</h1>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Filter"><IconFilter /></button>
          <a href="/app/profile" className="icon-btn" aria-label="Account"><IconUser /></a>
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
              </div>
              <span className="meta">{encode6D(item.lat, item.lng)} - {item.district}</span>
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
            <p className={styles.metaInfo}>{encode6D(selectedPudo.lat, selectedPudo.lng)} - {selectedPudo.district}</p>

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
