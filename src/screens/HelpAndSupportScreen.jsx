import React from 'react';
import styles from './StaticScreens.module.css'; // Use the shared CSS

export default function HelpAndSupportScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/profile" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Help & Support</h1>
      </header>
      <main className={styles.content}>
        {/* Placeholder for FAQ, Contact, User Guide tabs */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Frequently Asked Questions</h2>
          <p>FAQ content will go here.</p>
        </div>
      </main>
    </div>
  );
}
