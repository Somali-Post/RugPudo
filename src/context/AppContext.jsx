import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { translations } from '../translations';
import { AppContext } from './shared';

export const AppProvider = ({ children }) => {
  // Load initial PUDO state from localStorage
  const [pudo, setPudo] = useState(() => {
    const savedPudo = localStorage.getItem('selectedPudo');
    return savedPudo ? JSON.parse(savedPudo) : null;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [lastPudoChangeAt, setLastPudoChangeAt] = useState(() => {
    const ts = localStorage.getItem('lastPudoChangeAt');
    return ts ? Number(ts) : null;
  });
  
  const [language, setLanguage] = useState('English');
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Save PUDO to localStorage whenever it changes
  useEffect(() => {
    if (pudo) {
      localStorage.setItem('selectedPudo', JSON.stringify(pudo));
    } else {
      localStorage.removeItem('selectedPudo');
    }
  }, [pudo]);
  // Persist user info whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  // Persist last change timestamp
  useEffect(() => {
    if (lastPudoChangeAt) {
      localStorage.setItem('lastPudoChangeAt', String(lastPudoChangeAt));
    } else {
      localStorage.removeItem('lastPudoChangeAt');
    }
  }, [lastPudoChangeAt]);

  const selectPudo = (selectedPudo) => {
    setPudo(selectedPudo);
    setLastPudoChangeAt(Date.now());
  };
  
  const logout = () => {
    setPudo(null); // This will trigger the useEffect to remove from localStorage
    setUser(null);
  };

  const setUserInfo = ({ name, phone }) => {
    setUser({ name, phone });
  };

  const showToast = (title, message) => setToast({ show: true, title, message });
  const canChangePudo = () => {
    // First-time selection allowed; once a PUDO exists enforce 24h
    if (!pudo) return true;
    if (!lastPudoChangeAt) return true;
    const DAY_MS = 24 * 60 * 60 * 1000;
    return Date.now() - lastPudoChangeAt >= DAY_MS;
  };
  const content = translations[language];

  const value = {
    pudo,
    selectPudo,
    user,
    setUserInfo,
    logout,
    showToast,
    lastPudoChangeAt,
    canChangePudo,
    language,
    setLanguage,
    content,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onDismiss={() => setToast({ show: false, title: '', message: '' })}
      />
    </AppContext.Provider>
  );
};
