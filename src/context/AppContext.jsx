import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { translations } from '../translations.js'; // Import translations

// Create the main context
export const AppContext = createContext(null);

// Create the provider component
export const AppProvider = ({ children }) => {
  // Initialize state from localStorage, if available
  const [pudo, setPudo] = useState(() => {
    try {
      const savedPudo = localStorage.getItem('pudo');
      return savedPudo ? JSON.parse(savedPudo) : null;
    } catch (error) {
      console.error("Failed to parse PUDO from localStorage", error);
      return null;
    }
  });

  const [language, setLanguage] = useState('English'); // Language state
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Persist PUDO to localStorage whenever it changes
  useEffect(() => {
    try {
      if (pudo) {
        localStorage.setItem('pudo', JSON.stringify(pudo));
      } else {
        localStorage.removeItem('pudo');
      }
    } catch (error) {
      console.error("Failed to save PUDO to localStorage", error);
    }
  }, [pudo]);


  const selectPudo = (selectedPudo) => setPudo(selectedPudo);
  const logout = () => setPudo(null);
  const showToast = (title, message) => setToast({ show: true, title, message });

  // Get the current content based on the selected language
  const content = translations[language];

  const value = {
    pudo,
    selectPudo,
    logout,
    showToast,
    language,
    setLanguage, // Expose the setter function
    content,     // Expose the translated content
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

// Custom hook to easily access the context
export const useAppContext = () => {
  return useContext(AppContext);
};
