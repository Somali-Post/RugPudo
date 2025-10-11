import React from 'react';
import styles from './StaticScreens.module.css'; // Use the shared CSS

export default function AboutSpsScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/profile" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>About SPS</h1>
      </header>
      <main className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Somali Postal Service</h2>
          <p>Connecting Somalia through reliable postal services.</p>
          <p>Version 1.0.0</p>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Our Mission</h2>
          <p>To provide accessible, reliable, and modern postal services to all Somalis.</p>
        </div>
      </main>
    </div>
  );
}
