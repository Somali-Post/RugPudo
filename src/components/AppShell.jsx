import { Outlet } from "react-router-dom";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Toast from "./Toast";
import { ToastContext } from "../context/ToastContext"; // Import the context

export default function AppShell({ mode = "browse" }) {
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const showToast = (title, message) => {
    setToast({ show: true, title, message });
  };

  const handleProfileClick = () => {
    if (mode === "onboarding") {
      showToast("Please select a PUDO point first.");
    }
  };

  return (
    // Provide the showToast function to all child components
    <ToastContext.Provider value={{ showToast }}>
      <div className="app-shell">
        <Outlet />
        <BottomNav mode={mode} onProfileClick={handleProfileClick} />
        <Toast
          show={toast.show}
          title={toast.title}
          message={toast.message}
          onDismiss={() => setToast({ show: false, title: "", message: "" })}
        />
      </div>
    </ToastContext.Provider>
  );
}
