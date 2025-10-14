import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ProfileScreen.module.css';
import { IconMap, IconBox, IconGlobe, IconHelp, IconShield, IconInfo, IconLogout } from '../components/icons';
import { useAppContext } from '../context/AppContext';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the new component

const MOCK_USER_PROFILE = {
  name: 'Ahmed Mohamed',
  initials: 'AM',
  phone: '+252612345678',
};

export default function ProfileScreen() {
  const { pudo, logout, language, setLanguage, content } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'English' ? 'Somali' : 'English');
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsModalOpen(false);
    navigate('/'); // Navigate to home after logout
  };

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link to="/app/list" className={styles.backButton}>‹</Link>
          <h1 className={styles.headerTitle}>{content.profileTitle}</h1>
        </header>

        <main className={styles.content}>
          {/* ... UserCard, PUDO Card, and Package History Card remain the same ... */}
          <section className={styles.userCard}>
            <div className={styles.avatar}>{MOCK_USER_PROFILE.initials}<div className={styles.editIcon}>✎</div></div>
            <div className={styles.userInfo}>
              <h2>{MOCK_USER_PROFILE.name}</h2>
              <p>{MOCK_USER_PROFILE.phone}</p>
            </div>
          </section>

          <div className={styles.card}>
            <div className={styles.cardHeader}><IconMap /> {content.myPudoPoint}</div>
            {pudo ? (
              <><Link to="/select-pudo/list" className={styles.pudoInfo}><div><h3>{pudo.name}</h3><p>{pudo.addressCode}, {pudo.district}</p></div><span>›</span></Link><Link to="/select-pudo/list" className={styles.actionButton}>{content.changePudo}</Link></>
            ) : (
              <div className={styles.emptyState}><p>No PUDO point selected.</p></div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}><IconBox /> {content.packageHistory}</div>
            <div className={styles.emptyState}><p>No package history yet</p><p>Your package history will appear here</p></div>
            <Link to="/app/packages" className={styles.actionButton}>{content.viewAllPackages}</Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>{content.settings}</div>
            <div className={styles.settingsList}>
              <a href="#" onClick={toggleLanguage}>
                <IconGlobe /><span className={styles.label}>{content.language}</span><span className={styles.value}>{language} ›</span>
              </a>
              <Link to="/app/help"><IconHelp /><span className={styles.label}>{content.helpSupport}</span><span>›</span></Link>
              <Link to="/app/privacy"><IconShield /><span className={styles.label}>{content.privacySecurity}</span><span>›</span></Link>
              <Link to="/app/about"><IconInfo /><span className={styles.label}>{content.aboutSps}</span><span>›</span></Link>
              
              {/* Updated Logout Button */}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} className={styles.logout}>
                <IconLogout /><span className={styles.label}>{content.logout}</span><span>›</span>
              </a>
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout" // Pass the specific button text
      />
    </>
  );
}