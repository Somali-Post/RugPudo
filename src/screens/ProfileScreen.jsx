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
  const { pudo, logout, language, setLanguage, content } = useAppContext();

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'English' ? 'Somali' : 'English');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/app/list" className={styles.backButton}>‹</a>
        <h1 className={styles.headerTitle}>{content.profileTitle}</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.userCard}>
          <div className={styles.avatar}>{MOCK_USER_PROFILE.initials}</div>
          <div className={styles.userInfo}>
            <h2>{MOCK_USER_PROFILE.name}</h2>
            <p>{MOCK_USER_PROFILE.phone}</p>
          </div>
        </section>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconMap /> {content.myPudoPoint}</div>
          {pudo ? (
            <>
              <a href="/select-pudo/list" className={styles.pudoInfo}>
                <div>
                  <h3>{pudo.name}</h3>
                  <p>{pudo.addressCode}, {pudo.district}</p>
                </div>
                <span>›</span>
              </a>
              <a href="/select-pudo/list" className={styles.actionButton}>{content.changePudo}</a>
            </>
          ) : (
            <div className={styles.emptyState}><p>No PUDO point selected.</p></div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><IconBox /> {content.packageHistory}</div>
          <div className={styles.emptyState}>
            <p>No package history yet</p>
            <p>Your package history will appear here</p>
          </div>
          <a href="/app/packages" className={styles.actionButton}>{content.viewAllPackages}</a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>{content.settings}</div>
          <div className={styles.settingsList}>
            <a href="#" onClick={toggleLanguage}>
              <IconGlobe />
              <span className={styles.label}>{content.language}</span>
              <span className={styles.value}>{language} ›</span>
            </a>
            <a href="/app/help">
              <IconHelp />
              <span className={styles.label}>{content.helpSupport}</span>
              <span>›</span>
            </a>
            <a href="/app/privacy">
              <IconShield />
              <span className={styles.label}>{content.privacySecurity}</span>
              <span>›</span>
            </a>
            <a href="/app/about">
              <IconInfo />
              <span className={styles.label}>{content.aboutSps}</span>
              <span>›</span>
            </a>
            <a href="/" onClick={logout} className={styles.logout}>
              <IconLogout />
              <span className={styles.label}>{content.logout}</span>
              <span>›</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}