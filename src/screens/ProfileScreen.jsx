import React from 'react';
import styles from './ProfileScreen.module.css';
import { IconMap, IconBox, IconGlobe, IconHelp, IconShield, IconInfo, IconLogout } from '../components/icons';

const MOCK_USER_PROFILE = {
  name: 'Ahmed Mohamed',
  initials: 'AM',
  phone: '+252612345678',
  activePudo: {
    name: 'Juba Hypermarket',
    address: '39-74-71, Dagmadà Boondheere, Banaadir',
  },
};

export default function ProfileScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/list" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Profile</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.userCard}>
          <div className={styles.avatar}>{MOCK_USER_PROFILE.initials}</div>
          <div className={styles.userInfo}>
            <h2>{MOCK_USER_PROFILE.name}</h2>
            <p>{MOCK_USER_PROFILE.phone}</p>
          </div>
        </section>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconMap /> My PUDO Point</div>
          <div className={styles.pudoInfo}>
            <div>
              <h3>{MOCK_USER_PROFILE.activePudo.name}</h3>
              <p>{MOCK_USER_PROFILE.activePudo.address}</p>
            </div>
            <span>›</span>
          </div>
          <a href="/select-pudo/list">Change PUDO Point</a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconBox /> Package History</div>
          <div className={styles.emptyState}>
            <p>No package history yet</p>
          </div>
          <a href="/app/packages">View All Packages</a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Settings</div>
          <div className={styles.settingsList}>
            <a href="#">
              <IconGlobe />
              <span className={styles.label}>Language</span>
              <span className={styles.value}>English ›</span>
            </a>
            <a href="/app/help">
              <IconHelp />
              <span className={styles.label}>Help & Support</span>
              <span>›</span>
            </a>
            <a href="/app/privacy">
              <IconShield />
              <span className={styles.label}>Privacy & Security</span>
              <span>›</span>
            </a>
            <a href="/app/about">
              <IconInfo />
              <span className={styles.label}>About SPS</span>
              <span>›</span>
            </a>
            <a href="/" className={styles.logout}>
              <IconLogout />
              <span className={styles.label}>Logout</span>
              <span>›</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
