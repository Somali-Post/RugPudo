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

  // PUDO state is scoped per-user (keys: selectedPudo:{userId}, lastPudoChangeAt:{userId})
  const [pudo, setPudo] = useState(null);
  const [lastPudoChangeAt, setLastPudoChangeAt] = useState(null);

  const [language, setLanguage] = useState('English');
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Sync per-user PUDO from storage on user change
  useEffect(() => {
    if (user?.id) {
      try {
        const pudoRaw = localStorage.getItem(`selectedPudo:${user.id}`);
        setPudo(pudoRaw ? JSON.parse(pudoRaw) : null);
        const tsRaw = localStorage.getItem(`lastPudoChangeAt:${user.id}`);
        setLastPudoChangeAt(tsRaw ? Number(tsRaw) : null);
      } catch {
        setPudo(null);
        setLastPudoChangeAt(null);
      }
    } else {
      setPudo(null);
      setLastPudoChangeAt(null);
    }
  }, [user?.id]);

  // Persist PUDO whenever it changes (per-user)
  useEffect(() => {
    if (!user?.id) return;
    if (pudo) {
      localStorage.setItem(`selectedPudo:${user.id}`, JSON.stringify(pudo));
    } else {
      localStorage.removeItem(`selectedPudo:${user.id}`);
    }
  }, [pudo, user?.id]);

  // Persist user info (optional but handy)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Persist last change timestamp (per-user)
  useEffect(() => {
    if (!user?.id) return;
    if (lastPudoChangeAt) {
      localStorage.setItem(`lastPudoChangeAt:${user.id}`, String(lastPudoChangeAt));
    } else {
      localStorage.removeItem(`lastPudoChangeAt:${user.id}`);
    }
  }, [lastPudoChangeAt, user?.id]);

  const selectPudo = (selectedPudo) => {
    setPudo(selectedPudo);
    setLastPudoChangeAt(Date.now());
  };

  const login = (userData, selectedPudo = null) => {
    setUser(userData);
    if (selectedPudo) {
      setPudo(selectedPudo);
      setLastPudoChangeAt(Date.now());
    } else {
      // If no PUDO provided, loading will occur via the user change effect (per-user storage)
    }
  };

  const logout = () => {
    if (user?.id) {
      localStorage.removeItem(`selectedPudo:${user.id}`);
      localStorage.removeItem(`lastPudoChangeAt:${user.id}`);
    }
    setUser(null);
    setPudo(null);
    setLastPudoChangeAt(null);
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
