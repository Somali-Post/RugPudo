import React, { useState } from 'react';
import styles from './StaticScreens.module.css';
import { Link } from 'react-router-dom';
import { IconShield, IconLock, IconEye } from '../components/icons';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal

const Toggle = () => (
  <label className={styles.toggleSwitch}>
    <input type="checkbox" defaultChecked />
    <span className={styles.slider}></span>
  </label>
);

export default function PrivacyAndSecurityScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    // In a real app, this would trigger an API call to delete the user's account.
    console.log("Account deletion confirmed.");
    setIsModalOpen(false);
    // Then, you would likely navigate the user out of the app.
    // For now, we just log it.
  };

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/app/profile" className={styles.backButton}>‹</Link>
          <h1 className={styles.headerTitle}>Privacy & Security</h1>
        </header>
        <main className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><IconShield /> Privacy Settings</h2>
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
            <h2 className={styles.cardTitle}><IconLock /> Security</h2>
            <Link to="#" className={styles.listItem}>
              <div>
                <p className={styles.itemLabel}>Change Phone Number</p>
                <p className={styles.itemSublabel}>Update your registered phone number</p>
              </div>
              <span>›</span>
            </Link>
            {/* Updated Delete Account Button */}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} className={styles.listItem}>
              <p className={styles.itemLabel} style={{ color: 'var(--danger-red)' }}>Delete Account</p>
              <span>›</span>
            </a>
          </div>
           <div className={styles.card}>
            <h2 className={styles.cardTitle}><IconEye /> Privacy Policy</h2>
            <p>The Somali Postal Service (SPS) is committed to protecting your privacy...</p>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="Are you sure? This action is permanent and cannot be undone."
      />
    </>
  );
}
