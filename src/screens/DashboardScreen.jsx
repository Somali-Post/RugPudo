import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardScreen.module.css';
import BottomNavigationBar from '../components/BottomNavigationBar'; // Import the new component

const MOCK_USER_DATA = {
  name: 'Abdi',
  activePudo: {
    name: 'Juba Hypermarket',
    addressCode: '0.-43-22',
    district: 'Gufta',
  },
  parcelsReady: [
    { id: 'p1', from: 'Amazon UK', trackingId: 'UK758493022' },
    { id: 'p2', from: 'AliExpress', trackingId: 'CN938402199' },
  ],
  parcelsInTransit: [
    { id: 'p3', from: 'Ebay', arrivalEstimate: 'Oct 28' },
  ],
};

const DashboardScreen = () => {
  return (
    <div className={styles.container}>
      <main className={styles.scrollContainer}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Hello, {MOCK_USER_DATA.name}</h1>
          <button className={styles.notificationIcon}>�Y""</button>
        </header>

        <section className={styles.pudoCard}>
          <p className={styles.pudoCardLabel}>Your Active PUDO Point</p>
          <h2 className={styles.pudoCardName}>{MOCK_USER_DATA.activePudo.name}</h2>
          <p className={styles.pudoCardAddress}>
            {MOCK_USER_DATA.activePudo.addressCode} - {MOCK_USER_DATA.activePudo.district}
          </p>
          <button className={styles.pudoCardButton}>Change PUDO</button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Ready for Pickup ({MOCK_USER_DATA.parcelsReady.length})</h3>
          {MOCK_USER_DATA.parcelsReady.map(parcel => (
            <div key={parcel.id} className={`${styles.parcelCard} ${styles.parcelCardReady}`}>
              <div className={styles.parcelIconContainer}>�Y"�</div>
              <div className={styles.parcelInfo}>
                <p className={styles.parcelFrom}>{parcel.from}</p>
                <p className={styles.parcelTracking}>{parcel.trackingId}</p>
              </div>
              <span className={styles.viewCodeText}>View Code �?�</span>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>In Transit ({MOCK_USER_DATA.parcelsInTransit.length})</h3>
          {MOCK_USER_DATA.parcelsInTransit.map(parcel => (
            <Link to={`/app/parcel/${parcel.id}`} key={parcel.id} className={`${styles.parcelCard} ${styles.parcelCardTransit}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={styles.parcelInfo}>
                <p className={styles.parcelFrom}>{parcel.from}</p>
                <p className={styles.parcelTracking}>Est. Arrival: {parcel.arrivalEstimate}</p>
              </div>
              <span className={styles.viewCodeText}>Track �?�</span>
            </Link>
          ))}
        </section>
      </main>
      
      <BottomNavigationBar activeScreen="Home" />
    </div>
  );
};

export default DashboardScreen;

