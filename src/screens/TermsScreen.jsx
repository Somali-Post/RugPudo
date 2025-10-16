import React from 'react';
import styles from './TermsAndPrivacy.module.css';

export default function TermsScreen() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>Terms of Service</h1>
      </header>
      <main className={styles.content}>
        <h2>1. Introduction</h2>
        <p>Welcome to Rug, the official PUDO application of the Somali Postal Service (SPS), under the Ministry of Communication and Technology. These Terms of Service govern your use of our application and services.</p>
        <h2>2. Service Description</h2>
        <p>The Rug app provides a digital addressing system by linking your Somali phone number to a designated Pick-Up/Drop-Off (PUDO) point for the purpose of receiving mail and parcels.</p>
        <h2>3. User Accounts</h2>
        <p>You must register using a valid Somali phone number. You are responsible for maintaining the confidentiality of your account and any verification codes sent to your number.</p>
        <h2>4. Use of Service</h2>
        <p>You agree to use the Rug app only for lawful purposes. You may not use the service to receive illicit goods. SPS reserves the right to inspect packages in accordance with national and international postal regulations.</p>
        <h2>5. Limitation of Liability</h2>
        <p>The Somali Postal Service will exercise due care in the handling of your mail and parcels. However, we are not liable for losses or damages caused by circumstances beyond our control, including but not limited to incorrect information provided by the sender or recipient.</p>
      </main>
    </div>
  );
}
