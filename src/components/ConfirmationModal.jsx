import React from 'react';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.button} ${styles.confirm}`} onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}