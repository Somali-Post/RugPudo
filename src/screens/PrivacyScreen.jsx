import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TermsAndPrivacy.module.css';

export default function PrivacyScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backButton}>‹</Link>
        <h1 className={styles.headerTitle}>Privacy Policy</h1>
      </header>
      <main className={styles.content}>
        <h2>1. Information We Collect</h2>
        <p>We collect the following information: your full name, your Somali phone number, and your chosen PUDO point location. We may also collect location data if you grant permission, solely for the purpose of helping you find nearby PUDO points.</p>
        <h2>2. How We Use Your Information</h2>
        <p>Your phone number is used as your primary digital address to route packages to your selected PUDO point. Your name is used for identification at the collection point. We do not sell or share your personal data with third parties for marketing purposes.</p>
        <h2>3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data. All data is transmitted over encrypted channels (HTTPS). Access to personal information is restricted to authorized Somali Postal Service personnel.</p>
        <h2>4. Data Retention</h2>
        <p>We retain your account information as long as your account is active. Package delivery records are retained in accordance with national postal service regulations.</p>
      </main>
    </div>
  );
}

