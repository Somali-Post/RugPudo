import React from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
