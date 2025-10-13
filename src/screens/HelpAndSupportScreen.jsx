import React, { useState } from 'react';
import styles from './StaticScreens.module.css';

const FAQ = () => (
  <div>
    <details className={styles.accordionItem}>
      <summary>What is a PUDO point?</summary>
      <p className={styles.accordionContent}>A PUDO (Pick-Up/Drop-Off) point is a local business, like a supermarket or pharmacy, that partners with the Somali Postal Service to act as a delivery and collection center for your packages.</p>
    </details>
    <details className={styles.accordionItem}>
      <summary>How do I select a PUDO point?</summary>
      <p className={styles.accordionContent}>After registering, you can browse all available PUDO points on the List or Map view and select the one most convenient for you.</p>
    </details>
  </div>
);

const ContactUs = () => <p>Contact Us form will go here.</p>;
const UserGuide = () => <p>User Guide content will go here.</p>;

export default function HelpAndSupportScreen() {
  const [activeTab, setActiveTab] = useState('FAQ');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/profile" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Help & Support</h1>
      </header>
      <main className={styles.content}>
        <div className={styles.tabSelector}>
          <button className={`${styles.tab} ${activeTab === 'FAQ' ? styles.activeTab : ''}`} onClick={() => setActiveTab('FAQ')}>FAQ</button>
          <button className={`${styles.tab} ${activeTab === 'Contact' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Contact')}>Contact Us</button>
          <button className={`${styles.tab} ${activeTab === 'Guide' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Guide')}>User Guide</button>
        </div>
        <div className={styles.card}>
          {activeTab === 'FAQ' && <FAQ />}
          {activeTab === 'Contact' && <ContactUs />}
          {activeTab === 'Guide' && <UserGuide />}
        </div>
      </main>
    </div>
  );
}
