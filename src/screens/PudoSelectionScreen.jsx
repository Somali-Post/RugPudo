import React, { useState, useMemo } from 'react';
import styles from './PudoSelectionScreen.module.css';
import { colors } from '../styles/colors';
import NotificationBanner from '../components/NotificationBanner'; // Import the new component

const content = {
  English: {
    title: "PUDO Points",
    searchPlaceholder: "Search by name, location or 6d address…",
    open: "Open",
    closed: "Closed",
    distanceUnit: "km",
    reviews: "reviews",
    detailsTab: "Details",
    photosTab: "Photos",
    hoursLabel: "Hours",
    phoneLabel: "Phone",
    ratingLabel: "Rating",
    selectButton: "Select as My PUDO",
    mapButton: "View on Map",
    notificationTitle: "Great, You are now Registered!",
    notificationMessage: "Your PUDO point is now set to",
  },
  Somali: {
    title: "Goobaha PUDO",
    searchPlaceholder: "Ku raadi magac, goob ama ciwaan 6d…",
    open: "Furan",
    closed: "Xiran",
    distanceUnit: "km",
    reviews: "faallooyin",
    detailsTab: "Faahfaahin",
    photosTab: "Sawirro",
    hoursLabel: "Saacadaha",
    phoneLabel: "Telefoon",
    ratingLabel: "Qiimeyn",
    selectButton: "U dooro PUDO ahaan",
    mapButton: "Khariidada ka eeg",
    notificationTitle: "Wanaagsan, Hadda waad diiwaan gashan tahay!",
    notificationMessage: "Goobtaada PUDO hadda waa",
  }
};

const MOCK_PUDO_DATA = [
  { id: '1', name: 'Fiqi Supermarket', status: 'Open', addressCode: '0.-43-61', district: 'Yaaqshiid', hours: 'Open 24 hours', distance: '0.8', rating: 4.6, reviewCount: 31, phone: '+252 61 4675555' },
  { id: '2', name: 'Juba Hypermarket', status: 'Open', addressCode: '0.-43-22', district: 'Gufta', hours: 'Opens 8 AM', distance: '1.2', rating: 4.7, reviewCount: 15, phone: '+252 61 1234567' },
  { id: '3', name: 'Hodan Global', status: 'Closed', addressCode: '1.-12-89', district: 'Hodan', hours: 'Opens 9 AM', distance: '2.5', rating: 4.2, reviewCount: 45, phone: '+252 61 7654321' },
];

const PudoSelectionScreen = () => {
  const [language, setLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [selectedPudo, setSelectedPudo] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const [notification, setNotification] = useState({ show: false, title: '', message: '' });

  const currentContent = content[language];

  const filteredData = useMemo(() =>
    MOCK_PUDO_DATA.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addressCode.includes(searchQuery)
    ), [searchQuery]);

  const handleCardPress = (pudo) => {
    setSelectedPudo(pudo);
    setActiveTab('Details');
    setSheetVisible(true);
  };

  const handleSelectPudo = () => {
    if (!selectedPudo) return;
    setSheetVisible(false);
    setNotification({
      show: true,
      title: currentContent.notificationTitle,
      message: `${currentContent.notificationMessage} ${selectedPudo.name}`,
    });
  };

  const handleNotificationDismiss = () => {
    setNotification({ show: false, title: '', message: '' });
    // TODO: Navigate to Dashboard here
    console.log("Notification dismissed. Should navigate to Dashboard now.");
  };
  
  const PudoCard = ({ item }) => (
    <div className={styles.card} onClick={() => handleCardPress(item)}>
      <div className={styles.cardRow}>
        <span className={styles.cardName}>{item.name}</span>
        <span className={styles.statusTag} style={{ backgroundColor: item.status === 'Open' ? colors.successGreen : '#E74C3C' }}>
          {item.status === 'Open' ? currentContent.open : currentContent.closed}
        </span>
      </div>
      <p className={styles.cardText}>{item.addressCode} - {item.district}</p>
      <div className={styles.cardRow}>
        <span className={styles.cardText}>🕒 {item.hours}</span>
        <span className={styles.cardDistance}>{item.distance} {currentContent.distanceUnit}</span>
      </div>
      <p className={styles.cardText}>⭐ {item.rating} ({item.reviewCount} {currentContent.reviews})</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <NotificationBanner 
        show={notification.show}
        title={notification.title}
        message={notification.message}
        onDismiss={handleNotificationDismiss}
      />

      <header className={styles.header}>
        <button className={styles.headerIcon}>☰</button>
        <h1 className={styles.headerTitle}>{currentContent.title}</h1>
        <div className={styles.headerRightIcons}>
          <button className={styles.headerIcon}>🔍</button>
          <button className={styles.headerIcon}>👤</button>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={currentContent.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <main className={styles.listContainer}>
        {filteredData.map(item => <PudoCard key={item.id} item={item} />)}
      </main>

      {isSheetVisible && selectedPudo && (
        <div className={styles.sheetOverlay} onClick={() => setSheetVisible(false)}>
          <div className={styles.sheetContainer} onClick={(e) => e.stopPropagation()}>
            <header className={styles.sheetHeader}>
              <div>
                <h2 className={styles.sheetTitle}>{selectedPudo.name}</h2>
                <p className={styles.sheetSubTitle}>{selectedPudo.addressCode} - {selectedPudo.district}</p>
              </div>
              <button className={styles.closeIcon} onClick={() => setSheetVisible(false)}>✕</button>
            </header>

            <div className={styles.tabSelector}>
              <button className={`${styles.tab} ${activeTab === 'Details' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Details')}>
                {currentContent.detailsTab}
              </button>
              <button className={`${styles.tab} ${activeTab === 'Photos' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Photos')}>
                {currentContent.photosTab}
              </button>
            </div>

            {activeTab === 'Details' && (
              <div className={styles.detailsSection}>
                <div className={styles.detailRow}><span className={styles.detailLabel}>🕒 {currentContent.hoursLabel}</span> <span className={styles.detailValue}>{selectedPudo.hours}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>📞 {currentContent.phoneLabel}</span> <span className={styles.detailValue}>{selectedPudo.phone}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>⭐ {currentContent.ratingLabel}</span> <span className={styles.detailValue}>{selectedPudo.rating} ({selectedPudo.reviewCount} {currentContent.reviews})</span></div>
              </div>
            )}
            {activeTab === 'Photos' && (
              <div className={styles.photosSection}><p className={styles.detailValue}>Photo gallery will be here.</p></div>
            )}

            <div className={styles.actionButtonsContainer}>
              <button className={styles.secondaryButton}>{currentContent.mapButton}</button>
              <button className={styles.primaryButton} onClick={handleSelectPudo}>{currentContent.selectButton}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PudoSelectionScreen;