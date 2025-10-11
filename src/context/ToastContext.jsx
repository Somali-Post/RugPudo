import { createContext, useContext } from 'react';

// This creates a context with a placeholder function.
// The real function will be provided by our AppShell.
export const ToastContext = createContext({
  showToast: (title, message) => {},
});

// This is a custom hook that makes it easy for any component to use the toast.
export const useToast = () => {
  return useContext(ToastContext);
};
