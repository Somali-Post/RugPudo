import React from 'react';
import styles from './ProfileScreen.module.css';
import { IconMap, IconBox, IconGlobe, IconHelp, IconShield, IconInfo, IconLogout } from '../components/icons';
import { useAppContext } from '../context/AppContext';

const MOCK_USER_PROFILE = {
  name: 'Ahmed Mohamed',
  initials: 'AM',
  phone: '+252612345678',
};

export default function ProfileScreen() {
  const { pudo, logout } = useAppContext();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/list" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Profile</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.userCard}>
          <div className={styles.avatar}>
            {MOCK_USER_PROFILE.initials}
            <div className={styles.editIcon}>✎</div>
          </div>
          <div className={styles.userInfo}>
            <h2>{MOCK_USER_PROFILE.name}</h2>
            <p>{MOCK_USER_PROFILE.phone}</p>
          </div>
        </section>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconMap /> My PUDO Point</div>
          {pudo ? (
            <>
              <a href="/select-pudo/list" className={styles.pudoInfo}>
                <div>
                  <h3>{pudo.name}</h3>
                  <p>{pudo.addressCode}, {pudo.district}</p>
                </div>
                <span>›</span>
              </a>
              <a href="/select-pudo/list" className={styles.actionButton}>Change PUDO Point</a>
            </>
          ) : (
            <div className={styles.emptyState}><p>No PUDO point selected.</p></div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconBox /> Package History</div>
          <div className={styles.emptyState}>
            <p>No package history yet</p>
            <p>Your package history will appear here</p>
          </div>
          <a href="/app/packages" className={styles.actionButton}>View All Packages</a>
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
            <a href="/" onClick={logout} className={styles.logout}>
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