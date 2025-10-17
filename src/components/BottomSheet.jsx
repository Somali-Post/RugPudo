import React, { useEffect } from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
