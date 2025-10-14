import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';
import { translations } from '../content/translations'; // Import translations

// Create the main context
export const AppContext = createContext(null);

// Create the provider component
export const AppProvider = ({ children }) => {
  const [pudo, setPudo] = useState(null);
  const [language, setLanguage] = useState('English'); // Language state
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

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