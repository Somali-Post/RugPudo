import { Outlet } from "react-router-dom";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Toast from "./Toast";

export default function AppShell({ showBottomNav = true }) {
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const handleProfileClick = () => {
    if (!showBottomNav) { // This implies we are in onboarding mode
      showToast("Please select a PUDO point.");
    }
  };

  return (
    <div className="app-shell">
      <Outlet />
      {showBottomNav && <BottomNav onProfileClick={handleProfileClick} />}
      <Toast
        show={toast.show}
        message={toast.message}
        onDismiss={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}