import React from 'react';
import styles from './StaticScreens.module.css'; // Use the shared CSS

const Toggle = () => (
  <label className={styles.toggleSwitch}>
    <input type="checkbox" defaultChecked />
    <span className={styles.slider}></span>
  </label>
);

export default function PrivacyAndSecurityScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/profile" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Privacy & Security</h1>
      </header>
      <main className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Privacy Settings</h2>
          <div className={styles.listItem}>
            <p className={styles.itemLabel}>Location Services</p>
            <Toggle />
          </div>
          <div className={styles.listItem}>
            <p className={styles.itemLabel}>Notifications</p>
            <Toggle />
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Security</h2>
          <div className={styles.listItem}>
            <div>
              <p className={styles.itemLabel}>Change Phone Number</p>
              <p className={styles.itemSublabel}>Update your registered phone number</p>
            </div>
            <span>›</span>
          </div>
          <div className={styles.listItem}>
            <p className={styles.itemLabel}>Delete Account</p>
            <span>›</span>
          </div>
        </div>
      </main>
    </div>
  );
}
