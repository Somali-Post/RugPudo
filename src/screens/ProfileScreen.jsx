import React from 'react';
import styles from './ProfileScreen.module.css';

const MOCK_USER_PROFILE = {
  name: 'Abdi Gaal',
  phone: '+252 612345678',
  activePudo: {
    name: 'Juba Hypermarket',
    addressCode: '04-31-25',
  },
};

const ProfileScreen = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>My Profile</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Full Name</span>
            <span className={styles.infoValue}>{MOCK_USER_PROFILE.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone Number</span>
            <span className={styles.infoValue}>{MOCK_USER_PROFILE.phone}</span>
          </div>
        </section>

        <section className={styles.pudoCard}>
          <p className={styles.pudoCardLabel}>Your Active PUDO Point</p>
          <h2 className={styles.pudoCardName}>{MOCK_USER_PROFILE.activePudo.name}</h2>
        </section>

        <a href="/select-pudo" className={styles.actionButton}>
          Change PUDO Point
        </a>
        
        <a href="/" className={`${styles.actionButton} ${styles.logoutButton}`}>
          Logout
        </a>
      </main>
      {/* We will add the BottomNavigationBar back when we wire up the main tab router */}
    </div>
  );
};

export default ProfileScreen;