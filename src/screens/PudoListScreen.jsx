import React, { useState, useMemo } from 'react';
import { IconMenu, IconFilter, IconUser, IconSearch, IconClock, IconStar, IconMap } from '../components/icons';
import BottomSheet from '../components/BottomSheet'; // Import the new component
import styles from '../components/BottomSheet.module.css'; // Import styles for content
import { useToast } from '../context/ToastContext';

const MOCK_PUDO_DATA = [
  { id: '1', name: 'Somali Postal Service', district: 'Boondheere', lat: 2.04027, lng: 45.34715, hours: 'Opens 8 AM', distance: '1.8', rating: 4.8, reviewCount: 150, phone: '+252 61 1112222' },
  { id: '2', name: 'Hayat Market Boondheere', district: 'Boondheere', lat: 2.04162, lng: 45.34816, hours: 'Opens 9 AM', distance: '2.1', rating: 4.5, reviewCount: 78, phone: '+252 61 3334444' },
  { id: '3', name: 'Hayat Market (KM5 Zope)', district: 'Hodan', lat: 2.03084, lng: 45.30356, hours: 'Open 24 hours', distance: '3.5', rating: 4.6, reviewCount: 210, phone: '+252 61 5556666' },
  { id: '4', name: 'Hayat Market (KM4 Taleex)', district: 'Waaberi', lat: 2.03209, lng: 45.31291, hours: 'Opens 7 AM', distance: '2.9', rating: 4.7, reviewCount: 180, phone: '+252 61 7778888' },
];

export default function PudoListScreen({ mode = "browse", onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPudo, setSelectedPudo] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const { showToast } = useToast();

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
