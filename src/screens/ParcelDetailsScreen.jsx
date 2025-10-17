import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ParcelDetailsScreen.module.css';

// In a real app, you would fetch this data based on a parcel ID from the URL
const MOCK_PARCEL_DATA = {
  id: 'p1',
  from: 'Amazon UK',
  trackingId: 'UK758493022',
  pickupCode: '843197',
  trackingHistory: [
    { status: 'Ready for Pickup', date: 'Oct 11, 2025 - 10:30 AM', active: true },
    { status: 'Dispatched to PUDO Juba Hypermarket', date: 'Oct 10, 2025 - 4:15 PM', active: false },
    { status: 'Received at Mogadishu MPC', date: 'Oct 10, 2025 - 9:00 AM', active: false },
    { status: 'Shipped from Origin', date: 'Oct 08, 2025 - 11:20 PM', active: false },
  ],
};

const ParcelDetailsScreen = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/app" className={styles.backButton}>‹</Link>
        <h1 className={styles.headerTitle}>Parcel Details</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.codeCard}>
          <p className={styles.codeLabel}>Your Pickup Code</p>
          <p className={styles.code}>{MOCK_PARCEL_DATA.pickupCode}</p>
        </section>

        <section className={styles.parcelInfo}>
          <h2 className={styles.parcelFrom}>{MOCK_PARCEL_DATA.from}</h2>
          <p className={styles.parcelTracking}>Tracking ID: {MOCK_PARCEL_DATA.trackingId}</p>
        </section>

        <section>
          <h3 className={styles.trackingSectionTitle}>Tracking History</h3>
          <div className={styles.timeline}>
            {MOCK_PARCEL_DATA.trackingHistory.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${item.active ? styles.activeDot : ''}`} />
                <p className={styles.timelineStatus}>{item.status}</p>
                <p className={styles.timelineDate}>{item.date}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParcelDetailsScreen;

