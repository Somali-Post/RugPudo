import React, { useState } from 'react';
import styles from './ParcelsScreen.module.css';

const MOCK_PARCELS = [
  { id: 'p1', from: 'Amazon UK', status: 'Ready for Pickup', isDelivered: false },
  { id: 'p2', from: 'AliExpress', status: 'Ready for Pickup', isDelivered: false },
  { id: 'p3', from: 'Ebay', status: 'In Transit', isDelivered: false },
  { id: 'p4', from: 'Shein', status: 'Delivered on Oct 5', isDelivered: true },
  { id: 'p5', from: 'Temu', status: 'Delivered on Sep 28', isDelivered: true },
];

const ParcelListItem = ({ parcel }) => (
  <a href={`/app/parcel/${parcel.id}`} className={styles.parcelItem}>
    <div className={styles.iconContainer}>{parcel.isDelivered ? '✅' : '📦'}</div>
    <div className={styles.parcelInfo}>
      <p className={styles.parcelFrom}>{parcel.from}</p>
      <p className={styles.parcelStatus}>{parcel.status}</p>
    </div>
    <span className={styles.arrow}>›</span>
  </a>
);

const ParcelsScreen = () => {
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' or 'History'

  const activeParcels = MOCK_PARCELS.filter(p => !p.isDelivered);
  const historyParcels = MOCK_PARCELS.filter(p => p.isDelivered);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>My Parcels</h1>
      </header>

      <div className={styles.tabSelector}>
        <button
          className={`${styles.tab} ${activeTab === 'Active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Active')}
        >
          Active
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'History' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('History')}
        >
          History
        </button>
      </div>

      <main className={styles.listContainer}>
        {activeTab === 'Active' && activeParcels.map(parcel => (
          <ParcelListItem key={parcel.id} parcel={parcel} />
        ))}
        {activeTab === 'History' && historyParcels.map(parcel => (
          <ParcelListItem key={parcel.id} parcel={parcel} />
        ))}
      </main>
      {/* We will add the BottomNavigationBar back when we wire up the main tab router */}
    </div>
  );
};

export default ParcelsScreen;