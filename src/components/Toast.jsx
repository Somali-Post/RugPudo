import React, { useEffect, useState } from 'react';
import '../global.css';

export default function Toast({ title, message, show, duration = 3000, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 400); // Allow time for fade-out animation
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onDismiss]);

  return (
    <div className={`toast-notification ${visible ? 'show' : ''}`}>
      <p className="toast-title">{title}</p>
      <p className="toast-message">{message}</p>
    </div>
  );
}
