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

  const selectPudo = (selectedPudo) => setPudo(selectedPudo);
  
  const logout = () => {
    setPudo(null); // This will trigger the useEffect to remove from localStorage
  };

  const showToast = (title, message) => setToast({ show: true, title, message });
  const content = translations[language];

  const value = {
    pudo,
    selectPudo,
    logout,
    showToast,
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