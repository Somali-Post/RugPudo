import React, { useEffect, useState } from 'react';
import styles from './NotificationBanner.module.css';

const NotificationBanner = ({ show, title, message, duration = 4000, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) {
          // Allow time for fade-out animation before calling dismiss
          setTimeout(onDismiss, 300);
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, title, message, duration, onDismiss]);

  return (
    <div className={`${styles.container} ${visible ? styles.visible : ''}`} role="status" aria-live="polite">
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default NotificationBanner;