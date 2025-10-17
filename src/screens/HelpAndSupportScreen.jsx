import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './StaticScreens.module.css';
import { IconHelp, IconPhone, IconMail, IconMap } from '../components/icons';

const FAQ = () => (
  <div>
    <details className={styles.accordionItem}>
      <summary>What is a PUDO point?</summary>
      <p className={styles.accordionContent}>A PUDO (Pick-Up/Drop-Off) point is a local business, like a supermarket or pharmacy, that partners with the Somali Postal Service to act as a delivery and collection center for your packages.</p>
    </details>
    <details className={styles.accordionItem}>
      <summary>How do I select a PUDO point?</summary>
      <p className={styles.accordionContent}>After registering your phone number, you can browse all available PUDO points on the List or Map view. Simply tap on your preferred location and select it as your PUDO.</p>
    </details>
     <details className={styles.accordionItem}>
      <summary>Can I change my PUDO point later?</summary>
      <p className={styles.accordionContent}>Yes, you can change your PUDO point at any time through your Profile. Please note that a change may be restricted to once every 24 hours.</p>
    </details>
  </div>
);

const ContactUs = () => (
  <div>
    <h2 className={styles.cardTitle}>Get In Touch</h2>
    <div className={styles.listItem}><IconMap /><p>Jamhuriya Road, Boondheere District, Muqdisho, Somalia</p></div>
    <div className={styles.listItem}><IconMail /><p>posta@moct.gov.so</p></div>
    <div className={styles.listItem}><IconPhone /><p>252-611003239</p></div>
  </div>
);

const UserGuide = () => (
  <div>
    <h2>Getting Started</h2>
    <ol>
      <li>Register with your Somali mobile number.</li>
      <li>Verify your number with the SMS code.</li>
      <li>Find and select your preferred PUDO point from the map or list.</li>
    </ol>
    <h2>Receiving Packages</h2>
    <ul>
      <li>When sending packages, use your mobile number as the address.</li>
      <li>You will receive a notification when your package arrives at your PUDO.</li>
      <li>Go to your PUDO point to collect your package using the pickup code from the app.</li>
    </ul>
  </div>
);

export default function HelpAndSupportScreen() {
  const [activeTab, setActiveTab] = useState('FAQ');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/app/profile" className={styles.backButton}>‹</Link>
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

