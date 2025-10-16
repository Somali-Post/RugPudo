import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { translations } from '../translations';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // User profile stored in memory (also persisted locally for convenience)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load initial PUDO state from localStorage
  const [pudo, setPudo] = useState(() => {
    const savedPudo = localStorage.getItem('selectedPudo');
    return savedPudo ? JSON.parse(savedPudo) : null;
  });
  const [lastPudoChangeAt, setLastPudoChangeAt] = useState(() => {
    const ts = localStorage.getItem('lastPudoChangeAt');
    return ts ? Number(ts) : null;
  });

  const [language, setLanguage] = useState('English');
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Persist PUDO whenever it changes
  useEffect(() => {
    if (pudo) {
      localStorage.setItem('selectedPudo', JSON.stringify(pudo));
    } else {
      localStorage.removeItem('selectedPudo');
    }
  }, [pudo]);

  // Persist user info (optional but handy)
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

  const login = (userData, selectedPudo = null) => {
    setUser(userData);
    if (selectedPudo) {
      setPudo(selectedPudo);
      setLastPudoChangeAt(Date.now());
    }
  };

  const logout = () => {
    setUser(null);
    setPudo(null);
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
    user,
    pudo,
    login,
    logout,
    selectPudo,
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

export const useAppContext = () => useContext(AppContext);
