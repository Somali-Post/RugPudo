import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ProfileScreen.module.css';
import { IconMap, IconBox, IconGlobe, IconHelp, IconShield, IconInfo, IconLogout } from '../components/icons';
import { useAppContext } from '../context/shared';
import ConfirmationModal from '../components/ConfirmationModal';

const MOCK_USER_PROFILE = {
  name: 'Ahmed Mohamed',
  initials: 'AM',
  phone: '+252612345678',
};

export default function ProfileScreen() {
  const { pudo, user, logout, language, setLanguage, content, showToast, canChangePudo, lastPudoChangeAt } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'English' ? 'Somali' : 'English');
  };

  const changeLocked = pudo ? !canChangePudo() : false;
  const handleChangePudo = () => {
    if (changeLocked) {
      showToast('Limit Reached', 'You can only change your PUDO point once every 24 hours.');
      return;
    }
    navigate('/select-pudo/list');
  };

  // Cooldown timer text
  const [remainingMs, setRemainingMs] = useState(0);
  useEffect(() => {
    if (!changeLocked || !lastPudoChangeAt) { setRemainingMs(0); return; }
    const DAY_MS = 24 * 60 * 60 * 1000;
    const update = () => {
      const elapsed = Date.now() - lastPudoChangeAt;
      const remain = Math.max(0, DAY_MS - elapsed);
      setRemainingMs(remain);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [changeLocked, lastPudoChangeAt]);

  const remainingText = useMemo(() => {
    if (!remainingMs) return '';
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `Available in ${hours}h ${minutes}m`;
    if (minutes > 0) return `Available in ${minutes}m ${seconds}s`;
    return `Available in ${seconds}s`;
  }, [remainingMs]);

  const handleLogoutConfirm = () => {
    logout();
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>{content.profileTitle}</h1>
        </header>

        <main className={styles.content}>
          <section className={styles.userCard}>
            <div className={styles.avatar}>{((user?.name?.charAt(0)) || (MOCK_USER_PROFILE.initials?.charAt(0)) || 'A').toUpperCase()}<div className={styles.editIcon}>?</div></div>
            <div className={styles.userInfo}>
              <h2>{user?.name || MOCK_USER_PROFILE.name}</h2>
              <p>{user?.phone || MOCK_USER_PROFILE.phone}</p>
            </div>
          </section>

          <div className={styles.card}>
            <div className={styles.cardHeader}><IconMap /> {content.myPudoPoint}</div>
            {pudo ? (
              <>
                <div className={styles.pudoInfo}>
                  <div>
                    <h3>{pudo.name}</h3>
                    <p>{pudo.addressCode}, {pudo.district}</p>
                  </div>
                  <span>&gt;</span>
                </div>
                <button
                  type="button"
                  onClick={handleChangePudo}
                  className={`btn-cta`}
                  disabled={changeLocked}
                >
                  {content.changePudo}
                </button>
                {changeLocked && remainingText && (
                  <div className={styles.cooldownText}>{remainingText}</div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}><p>No PUDO point selected.</p></div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}><IconBox /> {content.packageHistory}</div>
            <>
              <div className={styles.emptyState}><p>No package history yet</p><p>Your package history will appear here</p></div>
              <Link to="/app/packages" className={`btn-cta`}>{content.viewAllPackages}</Link>
            </>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>{content.settings}</div>
            <div className={styles.settingsList}>
              <button type="button" onClick={toggleLanguage}>
                <IconGlobe /><span className={styles.label}>{content.language}</span><span className={styles.value}>{language} &gt;</span>
              </button>
              <Link to="/app/help"><IconHelp /><span className={styles.label}>{content.helpSupport}</span><span>&gt;</span></Link>
              <Link to="/app/privacy"><IconShield /><span className={styles.label}>{content.privacySecurity}</span><span>&gt;</span></Link>
              <Link to="/app/about"><IconInfo /><span className={styles.label}>{content.aboutSps}</span><span>&gt;</span></Link>
              <button type="button" onClick={() => setIsModalOpen(true)} className={styles.logout}>
                <IconLogout /><span className={styles.label}>{content.logout}</span><span>&gt;</span>
              </button>
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
        confirmText="Logout"
      />
    </>
  );
}