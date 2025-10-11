import React, { useEffect, useState } from 'react';
import '../global.css'; // We will add styles to global.css

export default function Toast({ message, show, duration = 3000, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onDismiss]);

  return (
    <div className={`toast-notification ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}