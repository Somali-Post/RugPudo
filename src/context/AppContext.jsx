import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// Create the main context
export const AppContext = createContext(null);

// Create the provider component
export const AppProvider = ({ children }) => {
  const [pudo, setPudo] = useState(null); // This is our auth state
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  // Auth functions
  const selectPudo = (selectedPudo) => {
    setPudo(selectedPudo);
    // In a real app, you'd save this to localStorage
  };

  const logout = () => {
    setPudo(null);
    // In a real app, you'd clear this from localStorage
  };

  // Toast functions
  const showToast = (title, message) => {
    setToast({ show: true, title, message });
  };

  const value = {
    pudo,
    selectPudo,
    logout,
    showToast,
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