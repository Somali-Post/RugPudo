import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './ParcelsScreen.module.css';
import { IconSearch, IconClock, IconMap, IconCheckCircle, IconBox, IconTruck } from '../components/icons';

const MOCK_PACKAGES = [
  { id: 'PKG-12345', from: 'Books from Amazon', date: 'May 15, 2023', location: 'Bakaara Market Post Office', status: 'Delivered' },
  { id: 'PKG-23456', from: 'Clothing from Dubai', date: 'May 20, 2023', location: 'Bakaara Market Post Office', status: 'Ready for Pickup' },
  { id: 'PKG-34567', from: 'Electronics from China', date: 'May 22, 2023', location: 'Bakaara Market Post Office', status: 'In Transit' },
];

const StatusIcon = ({ status }) => {
  if (status === 'Delivered') return <IconCheckCircle style={{ color: 'var(--success-green)' }} />;
  if (status === 'Ready for Pickup') return <IconBox style={{ color: 'var(--accent-cyan)' }} />;
  if (status === 'In Transit') return <IconTruck style={{ color: 'var(--vibrant-orange)' }} />;
  return null;
};

const PackageCard = ({ item }) => (
  <Link to={`/app/parcel/${item.id}`} className={styles.packageCard}>
    <div className={styles.packageId}>{item.from}</div>
    <div className={styles.packageIcon}>
      <StatusIcon status={item.status} />
    </div>
    <div className={styles.packageMeta}>
      <IconClock width={16} height={16} />
      <span>{item.date}</span>
    </div>
    <div className={styles.packageMeta}>
      <IconMap width={16} height={16} />
      <span>{item.location}</span>
    </div>
    <div className={`${styles.statusPill} ${
      item.status === 'Delivered' ? styles.statusDelivered :
      item.status === 'Ready for Pickup' ? styles.statusReady : styles.statusTransit
    }`}>
      {item.status}
    </div>
  </Link>
);

export default function ParcelsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPackages = useMemo(() => {
    let packages = MOCK_PACKAGES;
    if (activeTab !== 'All') {
      // A bit more robust filtering logic
      const normalizedTab = activeTab.toLowerCase().replace(' ', '');
      packages = packages.filter(p => p.status.toLowerCase().replace(' ', '') === normalizedTab);
    }
    if (searchQuery) {
      packages = packages.filter(p => p.id.toLowerCase().includes(searchQuery.toLowerCase()) || p.from.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return packages;
  }, [activeTab, searchQuery]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/app/profile" className={styles.backButton}>‹</Link>
        <h1 className={styles.headerTitle}>My Packages</h1>
      </header>

      <div className={styles.searchWrap}>
        <div className={styles.searchInput}>
          <IconSearch />
          <input 
            type="search" 
            placeholder="Search packages by ID or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tabSelector}>
        {['All', 'In Transit', 'Ready', 'Delivered'].map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className={styles.listContainer}>
        {filteredPackages.map(item => <PackageCard key={item.id} item={item} />)}
      </main>
    </div>
  );
}

